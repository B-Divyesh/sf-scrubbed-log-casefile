//! Redaction engine for Scrubbed Log Casefile.
//!
//! The library surface is intentionally small: compile a [`Policy`], create a
//! [`Redactor`] with a per-casefile salt, and call [`Redactor::scrub`].

use regex::{Captures, Regex};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;

/// A JSON policy file owned by the user.
#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct PolicyFile {
    /// Ordered rules appended after the built-in policy.
    pub rules: Vec<RuleSpec>,
}

/// One named redaction rule.
#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct RuleSpec {
    /// Human-readable name recorded in the manifest.
    pub name: String,
    /// Uppercase token category, for example `TENANT`.
    pub kind: String,
    /// Rust-compatible regular expression. If it contains a named `value`
    /// capture, only that capture is replaced.
    pub pattern: String,
}

#[derive(Debug, Clone)]
struct Rule {
    name: String,
    kind: String,
    regex: Regex,
    has_value_capture: bool,
}

/// A validated ordered set of rules.
#[derive(Debug, Clone)]
pub struct Policy {
    rules: Vec<Rule>,
}

impl Policy {
    /// Compile policy rules, optionally starting with the built-in safety set.
    pub fn compile(specs: Vec<RuleSpec>, include_defaults: bool) -> Result<Self, String> {
        let mut all = if include_defaults {
            builtin_rule_specs()
        } else {
            Vec::new()
        };
        all.extend(specs);
        if all.is_empty() {
            return Err("policy has no rules".into());
        }

        let mut rules = Vec::with_capacity(all.len());
        for spec in all {
            if spec.name.trim().is_empty() {
                return Err("rule name cannot be empty".into());
            }
            if spec.kind.is_empty()
                || !spec
                    .kind
                    .chars()
                    .all(|c| c.is_ascii_uppercase() || c.is_ascii_digit() || c == '_')
            {
                return Err(format!(
                    "rule '{}': kind must contain only A-Z, 0-9, and _",
                    spec.name
                ));
            }
            let regex = Regex::new(&spec.pattern)
                .map_err(|error| format!("rule '{}': invalid regex: {error}", spec.name))?;
            let has_value_capture = regex.capture_names().flatten().any(|name| name == "value");
            rules.push(Rule {
                name: spec.name,
                kind: spec.kind,
                regex,
                has_value_capture,
            });
        }
        Ok(Self { rules })
    }

    /// Names of all active rules, in application order.
    pub fn rule_names(&self) -> impl Iterator<Item = &str> {
        self.rules.iter().map(|rule| rule.name.as_str())
    }
}

/// Result of scrubbing one text value.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Scrubbed {
    /// Sanitized text.
    pub text: String,
    /// Match counts keyed by rule name; zero-hit rules are omitted.
    pub hits: BTreeMap<String, u64>,
}

/// Stateful redactor that keeps placeholders stable within a casefile.
#[derive(Debug, Clone)]
pub struct Redactor {
    policy: Policy,
    salt: [u8; 32],
}

impl Redactor {
    /// Create a redactor with a caller-provided random salt.
    pub fn new(policy: Policy, salt: [u8; 32]) -> Self {
        Self { policy, salt }
    }

    /// Scrub text and return only rule counts as provenance.
    pub fn scrub(&self, input: &str) -> Scrubbed {
        let mut text = input.to_owned();
        let mut hits = BTreeMap::new();

        for rule in &self.policy.rules {
            let mut count = 0_u64;
            let salt = self.salt;
            let kind = rule.kind.clone();
            let has_value_capture = rule.has_value_capture;
            text = rule
                .regex
                .replace_all(&text, |captures: &Captures<'_>| {
                    count += 1;
                    let whole = captures.get(0).expect("regex match always exists");
                    let value = if has_value_capture {
                        captures.name("value").unwrap_or(whole)
                    } else {
                        whole
                    };
                    let token = stable_token(&kind, value.as_str(), &salt);
                    if value.start() == whole.start() && value.end() == whole.end() {
                        token
                    } else {
                        let relative_start = value.start() - whole.start();
                        let relative_end = value.end() - whole.start();
                        format!(
                            "{}{}{}",
                            &whole.as_str()[..relative_start],
                            token,
                            &whole.as_str()[relative_end..]
                        )
                    }
                })
                .into_owned();
            if count > 0 {
                hits.insert(rule.name.clone(), count);
            }
        }
        Scrubbed { text, hits }
    }
}

fn stable_token(kind: &str, value: &str, salt: &[u8; 32]) -> String {
    let mut hash = Sha256::new();
    hash.update(salt);
    hash.update(value.as_bytes());
    let encoded = hex::encode_upper(hash.finalize());
    format!("<{kind}:{}>", &encoded[..8])
}

/// The conservative default rule set. It is a starting point, not a complete
/// PII detector.
pub fn builtin_rule_specs() -> Vec<RuleSpec> {
    vec![
        RuleSpec {
            name: "private-key".into(),
            kind: "PRIVATE_KEY".into(),
            pattern: r"(?s)-----BEGIN [A-Z ]*PRIVATE KEY-----.*?-----END [A-Z ]*PRIVATE KEY-----"
                .into(),
        },
        RuleSpec {
            name: "url-credentials".into(),
            kind: "URL_CREDENTIALS".into(),
            pattern: r"https?://(?P<value>[^\s/@:]+:[^\s/@]+)@".into(),
        },
        RuleSpec {
            name: "authorization-header".into(),
            kind: "AUTH".into(),
            pattern: r#"(?i)authorization\s*[:=]\s*["']?(?P<value>[^\s"',;&}]+(?:\s+[^\s"',;&}]+)?)"#.into(),
        },
        RuleSpec {
            name: "credential-assignment".into(),
            kind: "SECRET".into(),
            pattern: r#"(?i)["']?(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?token)["']?\s*[:=]\s*["']?(?P<value>[^\s"',;&}]+)"#.into(),
        },
        RuleSpec {
            name: "jwt".into(),
            kind: "JWT".into(),
            pattern: r"(?P<value>eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,})"
                .into(),
        },
        RuleSpec {
            name: "email".into(),
            kind: "EMAIL".into(),
            pattern: r"(?P<value>[A-Za-z0-9.!#$%&'*+/?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)"
                .into(),
        },
        RuleSpec {
            name: "ipv4".into(),
            kind: "IPV4".into(),
            pattern: r"(?P<value>\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b)"
                .into(),
        },
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn repeated_values_get_stable_tokens() {
        let policy = Policy::compile(Vec::new(), true).unwrap();
        let redactor = Redactor::new(policy, [7; 32]);
        let out = redactor.scrub("owner=a@b.dev again=a@b.dev other=c@d.dev");
        let tokens: Vec<_> = out
            .text
            .split_whitespace()
            .filter_map(|part| part.split('=').nth(1))
            .collect();
        assert_eq!(tokens[0], tokens[1]);
        assert_ne!(tokens[0], tokens[2]);
        assert_eq!(out.hits["email"], 3);
        assert!(!out.text.contains("a@b.dev"));
        let other_case = Redactor::new(Policy::compile(Vec::new(), true).unwrap(), [8; 32])
            .scrub("owner=a@b.dev");
        assert_ne!(tokens[0], other_case.text.split('=').nth(1).unwrap());
    }

    #[test]
    fn named_capture_preserves_context() {
        let policy = Policy::compile(
            vec![RuleSpec {
                name: "tenant".into(),
                kind: "TENANT".into(),
                pattern: r"tenant=(?P<value>[A-Z0-9]{8})".into(),
            }],
            false,
        )
        .unwrap();
        let out = Redactor::new(policy, [1; 32]).scrub("tenant=ABCD1234");
        assert!(out.text.starts_with("tenant=<TENANT:"));
        assert!(!out.text.contains("ABCD1234"));
    }

    #[test]
    fn default_policy_covers_core_secret_classes() {
        let policy = Policy::compile(Vec::new(), true).unwrap();
        let out = Redactor::new(policy, [3; 32]).scrub(
            "password=hunter2 ip=192.168.2.9 user=me@example.com Authorization: Bearer abcdefghijklmnop",
        );
        for secret in [
            "hunter2",
            "192.168.2.9",
            "me@example.com",
            "abcdefghijklmnop",
        ] {
            assert!(!out.text.contains(secret));
        }
    }

    #[test]
    fn default_policy_scrubs_quoted_json_and_yaml_credentials() {
        let policy = Policy::compile(Vec::new(), true).unwrap();
        let out = Redactor::new(policy, [4; 32]).scrub(
            r#"{
  "password": "json-secret-value",
  "api_key": "quoted-api-key-value",
  'access-token': 'single-quoted-value'
}
secret: yaml-secret-value"#,
        );
        for secret in [
            "json-secret-value",
            "quoted-api-key-value",
            "single-quoted-value",
            "yaml-secret-value",
        ] {
            assert!(!out.text.contains(secret), "credential survived: {secret}");
        }
        assert_eq!(out.hits["credential-assignment"], 4);
        assert!(out.text.contains(r#""password": "<SECRET:"#));
    }
}
