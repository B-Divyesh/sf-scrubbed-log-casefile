use assert_cmd::Command;
use predicates::prelude::*;
use std::fs;
use std::io::Read;

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
