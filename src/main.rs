use clap::{Args, Parser, Subcommand};
use rand::RngCore;
use scrubbed_log_casefile::{Policy, PolicyFile, Redactor};
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, HashSet};
use std::env;
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::{Component, Path, PathBuf};
use std::process::ExitCode;
use tempfile::NamedTempFile;
use walkdir::WalkDir;
use zip::AesMode;
use zip::write::SimpleFileOptions;

#[derive(Parser)]
#[command(
    name = "casefile",
    version,
    about = "Build a locally scrubbed, encrypted incident casefile",
    long_about = "Scrub logs, traces, and configuration with stable per-casefile tokens, then package them with a value-free manifest in an AES-256 encrypted ZIP. No data leaves this machine."
)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Scrub files/directories and create an encrypted ZIP casefile
    Pack(PackArgs),
}

#[derive(Args)]
struct PackArgs {
    /// Input files or directories (directories are walked recursively)
    #[arg(required = true, value_name = "INPUT")]
    inputs: Vec<PathBuf>,

    /// Output archive path; must end in .zip
    #[arg(short, long, value_name = "FILE")]
    output: PathBuf,

    /// Read the archive password from this environment variable
    #[arg(long, default_value = "CASEFILE_PASSWORD", value_name = "NAME")]
    password_env: String,

    /// Append rules from a project-owned JSON policy file
    #[arg(long, value_name = "FILE")]
    policy: Option<PathBuf>,

    /// Disable the conservative built-in rules
    #[arg(long)]
    no_default_rules: bool,

    /// Replace an existing output archive
    #[arg(long)]
    force: bool,

    /// Emit one machine-readable result object
    #[arg(long)]
    json: bool,
}

#[derive(Debug)]
struct AppError {
    message: String,
    usage: bool,
}

impl AppError {
    fn usage(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            usage: true,
        }
    }

    fn runtime(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            usage: false,
        }
    }
}

#[derive(Serialize)]
struct SuccessSummary {
    ok: bool,
    output: String,
    files_written: usize,
    files_skipped: usize,
    redactions: u64,
}

#[derive(Serialize)]
struct ErrorSummary<'a> {
    ok: bool,
    error: &'a str,
}

#[derive(Serialize)]
struct Manifest {
    format: &'static str,
    version: &'static str,
    created_unix_seconds: u64,
    statement: &'static str,
    token_scope: &'static str,
    rules: Vec<String>,
    rule_hits: BTreeMap<String, u64>,
    files: Vec<FileRecord>,
    skipped: Vec<SkippedRecord>,
}

#[derive(Serialize)]
struct FileRecord {
    path: String,
    source_fingerprint: String,
    input_bytes: usize,
    output_bytes: usize,
    rule_hits: BTreeMap<String, u64>,
}

#[derive(Serialize)]
struct SkippedRecord {
    path: String,
    reason: String,
}

struct InputFile {
    source: PathBuf,
    archive_path: String,
}

fn main() -> ExitCode {
    let cli = Cli::parse();
    match cli.command {
        Command::Pack(args) => {
            let json = args.json;
            match pack(args) {
                Ok(summary) => {
                    if json {
                        println!("{}", serde_json::to_string(&summary).expect("serializable"));
                    } else {
                        eprintln!(
                            "sealed {} file(s) in {} ({} redactions; {} skipped)",
                            summary.files_written,
                            summary.output,
                            summary.redactions,
                            summary.files_skipped
                        );
                        eprintln!("share the password through a separate channel");
                    }
                    ExitCode::SUCCESS
                }
                Err(error) => {
                    if json {
                        println!(
                            "{}",
                            serde_json::to_string(&ErrorSummary {
                                ok: false,
                                error: &error.message
                            })
                            .expect("serializable")
                        );
                    } else {
                        eprintln!("casefile: {}", error.message);
                    }
                    ExitCode::from(if error.usage { 2 } else { 1 })
                }
            }
        }
    }
}

fn pack(args: PackArgs) -> Result<SuccessSummary, AppError> {
    validate_output(&args.output, args.force)?;
    let password = env::var(&args.password_env).map_err(|_| {
        AppError::usage(format!(
            "password environment variable '{}' is not set",
            args.password_env
        ))
    })?;
    if password.chars().count() < 12 {
        return Err(AppError::usage(
            "archive password must be at least 12 characters",
        ));
    }

    let custom_rules = if let Some(path) = &args.policy {
        let raw = fs::read_to_string(path).map_err(|error| {
            AppError::usage(format!("cannot read policy '{}': {error}", path.display()))
        })?;
        serde_json::from_str::<PolicyFile>(&raw)
            .map_err(|error| {
                AppError::usage(format!("invalid policy '{}': {error}", path.display()))
            })?
            .rules
    } else {
        Vec::new()
    };
    let policy = Policy::compile(custom_rules, !args.no_default_rules).map_err(AppError::usage)?;
    let rule_names = policy.rule_names().map(str::to_owned).collect::<Vec<_>>();
    let mut salt = [0_u8; 32];
    rand::rng().fill_bytes(&mut salt);
    let redactor = Redactor::new(policy, salt);
    let (inputs, mut skipped) = collect_inputs(&args.inputs, &redactor)?;
    if inputs.is_empty() {
        return Err(AppError::usage(
            "no readable text files found in the supplied inputs",
        ));
    }

    let parent = args.output.parent().unwrap_or_else(|| Path::new("."));
    fs::create_dir_all(parent).map_err(|error| {
        AppError::runtime(format!(
            "cannot create output directory '{}': {error}",
            parent.display()
        ))
    })?;
    let mut temporary = NamedTempFile::new_in(parent)
        .map_err(|error| AppError::runtime(format!("cannot create temporary archive: {error}")))?;

    let (files, rule_hits, skipped_count) = {
        let mut zip = zip::ZipWriter::new(temporary.as_file_mut());
        let options = SimpleFileOptions::default()
            .compression_method(zip::CompressionMethod::Deflated)
            .unix_permissions(0o600)
            .with_aes_encryption(AesMode::Aes256, &password);
        let mut records = Vec::new();
        let mut totals = BTreeMap::<String, u64>::new();
        for input in inputs {
            let mut raw = Vec::new();
            match File::open(&input.source).and_then(|mut file| file.read_to_end(&mut raw)) {
                Ok(_) => {}
                Err(error) => {
                    skipped.push(SkippedRecord {
                        path: input.archive_path,
                        reason: format!("unreadable: {error}"),
                    });
                    continue;
                }
            }
            if raw.contains(&0) {
                skipped.push(SkippedRecord {
                    path: input.archive_path,
                    reason: "binary file (NUL byte detected)".into(),
                });
                continue;
            }
            let text = match String::from_utf8(raw.clone()) {
                Ok(text) => text,
                Err(_) => {
                    skipped.push(SkippedRecord {
                        path: input.archive_path,
                        reason: "non-UTF-8 text".into(),
                    });
                    continue;
                }
            };
            let scrubbed = redactor.scrub(&text);
            for (name, count) in &scrubbed.hits {
                *totals.entry(name.clone()).or_default() += count;
            }
            zip.start_file(&input.archive_path, options)
                .map_err(zip_error)?;
            zip.write_all(scrubbed.text.as_bytes()).map_err(io_error)?;
            records.push(FileRecord {
                path: input.archive_path,
                source_fingerprint: salted_fingerprint(&raw, &salt),
                input_bytes: raw.len(),
                output_bytes: scrubbed.text.len(),
                rule_hits: scrubbed.hits,
            });
        }

        if records.is_empty() {
            return Err(AppError::usage(
                "all supplied files were binary, non-UTF-8, or unreadable",
            ));
        }

        let skipped_count = skipped.len();
        let manifest = Manifest {
            format: "scrubbed-log-casefile",
            version: env!("CARGO_PKG_VERSION"),
            created_unix_seconds: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap_or_default()
                .as_secs(),
            statement: "Rule-based redaction is not proof that all sensitive data was detected. Review before sharing.",
            token_scope: "Stable only within this archive; fingerprints and tokens are salted per casefile.",
            rules: rule_names,
            rule_hits: totals.clone(),
            files: records,
            skipped,
        };
        let manifest_json = serde_json::to_vec_pretty(&manifest)
            .map_err(|error| AppError::runtime(format!("cannot serialize manifest: {error}")))?;
        zip.start_file("casefile-manifest.json", options)
            .map_err(zip_error)?;
        zip.write_all(&manifest_json).map_err(io_error)?;
        zip.finish().map_err(zip_error)?;
        temporary.as_file_mut().sync_all().map_err(io_error)?;
        (manifest.files.len(), totals, skipped_count)
    };

    temporary.persist(&args.output).map_err(|error| {
        AppError::runtime(format!(
            "cannot finalize '{}': {}",
            args.output.display(),
            error.error
        ))
    })?;

    Ok(SuccessSummary {
        ok: true,
        output: args.output.display().to_string(),
        files_written: files,
        files_skipped: skipped_count,
        redactions: rule_hits.values().sum(),
    })
}

fn validate_output(output: &Path, force: bool) -> Result<(), AppError> {
    if output.extension().and_then(|ext| ext.to_str()) != Some("zip") {
        return Err(AppError::usage("output path must end in .zip"));
    }
    if output.exists() && !force {
        return Err(AppError::usage(format!(
            "output '{}' already exists; use --force to replace it",
            output.display()
        )));
    }
    Ok(())
}

fn collect_inputs(
    inputs: &[PathBuf],
    redactor: &Redactor,
) -> Result<(Vec<InputFile>, Vec<SkippedRecord>), AppError> {
    let mut files = Vec::new();
    let mut skipped = Vec::new();
    let mut archive_names = HashSet::new();
    for input in inputs {
        let metadata = fs::symlink_metadata(input).map_err(|error| {
            AppError::usage(format!("cannot access '{}': {error}", input.display()))
        })?;
        if metadata.file_type().is_symlink() {
            skipped.push(SkippedRecord {
                path: safe_input_label(input, redactor),
                reason: "symlink".into(),
            });
        } else if metadata.is_file() {
            push_unique(
                input.clone(),
                safe_input_label(input, redactor),
                &mut archive_names,
                &mut files,
            );
        } else if metadata.is_dir() {
            let root_label = input
                .file_name()
                .unwrap_or_else(|| input.as_os_str())
                .to_string_lossy();
            for entry in WalkDir::new(input).follow_links(false).sort_by_file_name() {
                let entry = entry.map_err(|error| {
                    AppError::runtime(format!("cannot walk '{}': {error}", input.display()))
                })?;
                if entry.depth() == 0 || entry.file_type().is_dir() {
                    continue;
                }
                let relative = entry.path().strip_prefix(input).unwrap_or(entry.path());
                let joined = Path::new(root_label.as_ref()).join(relative);
                let archive_path = safe_archive_path(&joined, redactor);
                if entry.file_type().is_symlink() {
                    skipped.push(SkippedRecord {
                        path: archive_path,
                        reason: "symlink".into(),
                    });
                } else if entry.file_type().is_file() {
                    push_unique(
                        entry.path().to_owned(),
                        archive_path,
                        &mut archive_names,
                        &mut files,
                    );
                }
            }
        } else {
            skipped.push(SkippedRecord {
                path: safe_input_label(input, redactor),
                reason: "not a regular file or directory".into(),
            });
        }
    }
    Ok((files, skipped))
}

fn safe_input_label(path: &Path, redactor: &Redactor) -> String {
    let label = path
        .file_name()
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("input.log"));
    safe_archive_path(&label, redactor)
}

fn push_unique(
    source: PathBuf,
    mut name: String,
    used: &mut HashSet<String>,
    files: &mut Vec<InputFile>,
) {
    if !used.insert(name.clone()) {
        let mut index = 2;
        loop {
            let candidate = format!("duplicate-{index}/{name}");
            if used.insert(candidate.clone()) {
                name = candidate;
                break;
            }
            index += 1;
        }
    }
    files.push(InputFile {
        source,
        archive_path: name,
    });
}

fn safe_archive_path(path: &Path, redactor: &Redactor) -> String {
    let components = path.components().filter_map(|component| match component {
        Component::Normal(value) => Some(value.to_string_lossy()),
        _ => None,
    });
    let joined = components.collect::<Vec<_>>().join("/");
    let scrubbed = redactor.scrub(&joined).text;
    if scrubbed.is_empty() {
        "input.log".into()
    } else {
        scrubbed
    }
}

fn salted_fingerprint(bytes: &[u8], salt: &[u8; 32]) -> String {
    let mut hash = Sha256::new();
    hash.update(salt);
    hash.update(bytes);
    format!("sha256-salted:{}", hex::encode(hash.finalize()))
}

fn zip_error(error: zip::result::ZipError) -> AppError {
    AppError::runtime(format!("cannot write encrypted archive: {error}"))
}

fn io_error(error: std::io::Error) -> AppError {
    AppError::runtime(format!("cannot write encrypted archive: {error}"))
}
