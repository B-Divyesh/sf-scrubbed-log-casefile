use assert_cmd::Command;
use predicates::prelude::*;
use std::fs;
use std::io::Read;

const TEST_PASSWORD: &str = "correct horse battery staple";

#[test]
fn help_explains_the_security_boundary() {
    Command::cargo_bin("casefile")
        .unwrap()
        .arg("--help")
        .assert()
        .success()
        .stdout(predicate::str::contains("No data leaves this machine"));
}

#[test]
fn pack_rejects_a_missing_password_variable_with_json_error() {
    let temp = tempfile::tempdir().unwrap();
    let input = temp.path().join("app.log");
    fs::write(&input, "email=person@example.com").unwrap();
    Command::cargo_bin("casefile")
        .unwrap()
        .args([
            "pack",
            input.to_str().unwrap(),
            "--output",
            temp.path().join("out.zip").to_str().unwrap(),
            "--password-env",
            "CASEFILE_TEST_MISSING",
            "--json",
        ])
        .env_remove("CASEFILE_TEST_MISSING")
        .assert()
        .code(2)
        .stdout(predicate::str::contains("\"ok\":false"));
}

#[test]
fn pack_creates_an_archive_without_leaving_plaintext_temp_files() {
    let temp = tempfile::tempdir().unwrap();
    let input = temp.path().join("app.log");
    let output = temp.path().join("case.zip");
    fs::write(&input, "password=hunter2 user=person@example.com").unwrap();
    Command::cargo_bin("casefile")
        .unwrap()
        .args([
            "pack",
            input.to_str().unwrap(),
            "--output",
            output.to_str().unwrap(),
            "--password-env",
            "CASEFILE_TEST_PASSWORD",
            "--json",
        ])
        .env("CASEFILE_TEST_PASSWORD", "correct horse battery staple")
        .assert()
        .success()
        .stdout(predicate::str::contains("\"redactions\":2"));
    assert!(output.exists());
    let entries = fs::read_dir(temp.path()).unwrap().count();
    assert_eq!(entries, 2);
    let archive_bytes = fs::read(output).unwrap();
    assert!(!String::from_utf8_lossy(&archive_bytes).contains("hunter2"));
}

#[test]
fn encrypted_entries_decrypt_to_scrubbed_content_and_manifest() {
    let temp = tempfile::tempdir().unwrap();
    let input = temp.path().join("app.log");
    let output = temp.path().join("case.zip");
    fs::write(&input, "user=person@example.com ip=10.0.0.9").unwrap();
    Command::cargo_bin("casefile")
        .unwrap()
        .args([
            "pack",
            input.to_str().unwrap(),
            "--output",
            output.to_str().unwrap(),
            "--password-env",
            "CASEFILE_TEST_PASSWORD",
        ])
        .env("CASEFILE_TEST_PASSWORD", "correct horse battery staple")
        .assert()
        .success();

    let file = fs::File::open(output).unwrap();
    let mut archive = zip::ZipArchive::new(file).unwrap();
    let mut scrubbed = String::new();
    archive
        .by_name_decrypt("app.log", b"correct horse battery staple")
        .unwrap()
        .read_to_string(&mut scrubbed)
        .unwrap();
    assert!(!scrubbed.contains("person@example.com"));
    assert!(scrubbed.contains("<EMAIL:"));
    let mut manifest = String::new();
    archive
        .by_name_decrypt("casefile-manifest.json", b"correct horse battery staple")
        .unwrap()
        .read_to_string(&mut manifest)
        .unwrap();
    assert!(manifest.contains("\"email\": 1"));
    assert!(!manifest.contains("person@example.com"));
}

#[test]
fn documented_custom_policy_replaces_only_the_named_value_capture() {
    let temp = tempfile::tempdir().unwrap();
    let input = temp.path().join("tenant.log");
    let policy = temp.path().join("casefile-policy.json");
    let output = temp.path().join("case.zip");
    fs::write(&input, "tenant=ABCD1234 state=retry").unwrap();
    fs::write(
        &policy,
        r#"{"rules":[{"name":"tenant-id","kind":"TENANT","pattern":"tenant=(?P<value>[A-Z0-9]{8})"}]}"#,
    )
    .unwrap();
    Command::cargo_bin("casefile")
        .unwrap()
        .args([
            "pack",
            input.to_str().unwrap(),
            "--policy",
            policy.to_str().unwrap(),
            "--output",
            output.to_str().unwrap(),
            "--password-env",
            "CASEFILE_TEST_PASSWORD",
        ])
        .env("CASEFILE_TEST_PASSWORD", "correct horse battery staple")
        .assert()
        .success();

    let mut archive = zip::ZipArchive::new(fs::File::open(output).unwrap()).unwrap();
    let mut scrubbed = String::new();
    archive
        .by_name_decrypt("tenant.log", b"correct horse battery staple")
        .unwrap()
        .read_to_string(&mut scrubbed)
        .unwrap();
    assert!(scrubbed.starts_with("tenant=<TENANT:"));
    assert!(scrubbed.ends_with(" state=retry"));
}

#[test]
fn encrypted_archive_scrubs_standard_json_and_yaml_credentials() {
    let temp = tempfile::tempdir().unwrap();
    let input = temp.path().join("config.json");
    let output = temp.path().join("case.zip");
    fs::write(
        &input,
        r#"{"owner":"ria@example.com","server":"0.0.0.0","password":"json-secret-value","api_key":"quoted-api-key-value"}
secret: yaml-secret-value
Authorization: Bearer auth-secret-value
url=https://url-user:url-password@example.invalid/path
token=eyJabcdefgh.abcdefgh.abcdefgh
-----BEGIN PRIVATE KEY-----
private-key-material
-----END PRIVATE KEY-----"#,
    )
    .unwrap();
    Command::cargo_bin("casefile")
        .unwrap()
        .args([
            "pack",
            input.to_str().unwrap(),
            "--output",
            output.to_str().unwrap(),
            "--password-env",
            "CASEFILE_TEST_PASSWORD",
        ])
        .env("CASEFILE_TEST_PASSWORD", TEST_PASSWORD)
        .assert()
        .success();

    let mut archive = zip::ZipArchive::new(fs::File::open(output).unwrap()).unwrap();
    let mut scrubbed = String::new();
    archive
        .by_name_decrypt("config.json", TEST_PASSWORD.as_bytes())
        .unwrap()
        .read_to_string(&mut scrubbed)
        .unwrap();
    for secret in [
        "json-secret-value",
        "quoted-api-key-value",
        "yaml-secret-value",
        "auth-secret-value",
        "url-user:url-password",
        "eyJabcdefgh.abcdefgh.abcdefgh",
        "private-key-material",
        "ria@example.com",
        "0.0.0.0",
    ] {
        assert!(!scrubbed.contains(secret), "credential survived: {secret}");
    }
    assert!(scrubbed.contains(r#""password":"<SECRET:"#));
    drop(archive);

    let mut archive =
        zip::ZipArchive::new(fs::File::open(temp.path().join("case.zip")).unwrap()).unwrap();
    let mut manifest = String::new();
    archive
        .by_name_decrypt("casefile-manifest.json", TEST_PASSWORD.as_bytes())
        .unwrap()
        .read_to_string(&mut manifest)
        .unwrap();
    assert!(manifest.contains(r#""credential-assignment": 3"#));
    for rule in [
        "private-key",
        "url-credentials",
        "authorization-header",
        "jwt",
        "email",
        "ipv4",
    ] {
        assert!(manifest.contains(rule), "missing manifest rule: {rule}");
    }
    assert!(!manifest.contains("json-secret-value"));
}

#[test]
fn json_flag_covers_command_line_parse_errors() {
    let output = Command::cargo_bin("casefile")
        .unwrap()
        .args(["pack", "--json"])
        .output()
        .unwrap();
    assert_eq!(output.status.code(), Some(2));
    assert!(output.stderr.is_empty());
    let body: serde_json::Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(body["ok"], false);
    assert!(body["error"].as_str().unwrap().contains("required"));
}

#[test]
fn demo_builds_a_decryptable_casefile_from_bundled_samples() {
    let output = Command::cargo_bin("casefile")
        .unwrap()
        .args(["demo", "--json"])
        .output()
        .unwrap();
    assert!(output.status.success());
    let body: serde_json::Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(body["ok"], true);
    assert_eq!(body["files_written"], 2);
    let archive_path = std::path::PathBuf::from(body["output"].as_str().unwrap());
    let demo_root = archive_path.parent().unwrap().to_owned();
    assert!(archive_path.exists());
    assert!(demo_root.join("incident/app.log").exists());
    let mut archive = zip::ZipArchive::new(fs::File::open(&archive_path).unwrap()).unwrap();
    let mut scrubbed = String::new();
    archive
        .by_name_decrypt(
            "incident/config.json",
            body["password"].as_str().unwrap().as_bytes(),
        )
        .unwrap()
        .read_to_string(&mut scrubbed)
        .unwrap();
    assert!(!scrubbed.contains("json-demo-password"));
    assert!(!scrubbed.contains("json-demo-api-key"));
    drop(archive);
    fs::remove_dir_all(demo_root).unwrap();
}

#[test]
fn existing_output_is_unchanged_and_failed_pack_leaves_no_temporary_archive() {
    let temp = tempfile::tempdir().unwrap();
    let input = temp.path().join("app.log");
    let output = temp.path().join("case.zip");
    fs::write(&input, "password=must-not-survive").unwrap();
    fs::write(&output, b"existing archive bytes").unwrap();
    Command::cargo_bin("casefile")
        .unwrap()
        .args([
            "pack",
            input.to_str().unwrap(),
            "--output",
            output.to_str().unwrap(),
            "--password-env",
            "CASEFILE_TEST_PASSWORD",
            "--json",
        ])
        .env("CASEFILE_TEST_PASSWORD", TEST_PASSWORD)
        .assert()
        .code(2);
    assert_eq!(fs::read(&output).unwrap(), b"existing archive bytes");
    assert_eq!(fs::read_dir(temp.path()).unwrap().count(), 2);
}
