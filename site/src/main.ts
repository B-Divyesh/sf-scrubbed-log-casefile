import './styles.css';
import './route-focus';
import { createCaseSalt, scrubPreview } from './demo';

const slug = 'scrubbed-log-casefile';
const apiBase = 'https://api.sociobot.in/api/v1';
const licenseKey = `sb_license:${slug}`;
const verdictKey = `sb_license_verdict:${slug}`;
const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const rawLog = byId<HTMLTextAreaElement>('raw-log');
const output = byId<HTMLElement>('scrubbed-output');
const summary = byId<HTMLElement>('demo-summary');
const copyOutput = byId<HTMLButtonElement>('copy-output');
const previewSalt = createCaseSalt();

// Keep the catalog's ?demo=1 entry point as a one-click shortcut while the
// isolated, in-memory demo remains a real URL with its own title and banner.
const isDemoShortcut = new URLSearchParams(window.location.search).get('demo') === '1';
if (isDemoShortcut) {
  window.location.replace('/demo/');
} else {
  initializeHome();
}

function initializeHome() {
byId<HTMLButtonElement>('scrub-button').addEventListener('click', () => {
  if (!rawLog.value.trim()) {
    output.textContent = 'Nothing to scrub yet.';
    summary.textContent = 'Paste a log fragment or load the example, then try again.';
    copyOutput.disabled = true;
    rawLog.focus();
    return;
  }
  const result = scrubPreview(rawLog.value, previewSalt);
  output.textContent = result.text;
  const total = Object.values(result.counts).reduce((sum, count) => sum + count, 0);
  const details = Object.entries(result.counts).map(([name, count]) => `${name}: ${count}`).join(' · ');
  summary.textContent = total ? `${total} sensitive value${total === 1 ? '' : 's'} replaced · ${details}` : 'No built-in rule matched. Add a project rule in a policy file.';
  copyOutput.disabled = false;
});

byId<HTMLButtonElement>('load-example').addEventListener('click', () => {
  rawLog.value = '2026-08-28 ERROR login failed user=ria@example.com ip=10.2.3.44\nretry user=ria@example.com\n"password": "json-demo-password"\nAuthorization: Bearer abcdefghijklmnop';
  rawLog.focus();
});

async function copyText(value: string, button: HTMLButtonElement) {
  try {
    await navigator.clipboard.writeText(value);
    const old = button.textContent;
    button.textContent = 'Copied';
    window.setTimeout(() => { button.textContent = old; }, 1500);
  } catch {
    summary.textContent = 'Copy was blocked by the browser. Select the text and copy it manually.';
  }
}

copyOutput.addEventListener('click', () => copyText(output.textContent ?? '', copyOutput));
byId<HTMLButtonElement>('copy-command').addEventListener('click', (event) => copyText(byId('install-command').textContent ?? '', event.currentTarget as HTMLButtonElement));

const offlineBar = byId<HTMLElement>('offline-bar');
function updateConnection() { offlineBar.hidden = navigator.onLine; }
window.addEventListener('offline', updateConnection);
updateConnection();

type Verdict = { valid: boolean; checkedAt: number };
function setUnlocked(valid: boolean, notice?: string) {
  byId<HTMLElement>('unlocked-content').hidden = !valid;
  byId<HTMLElement>('license-status').textContent = notice ?? (valid ? 'Team-pack license active on this device.' : 'No active team-pack license on this device.');
  document.body.dataset.licensed = String(valid);
}
function readVerdict(): Verdict | null {
  try { return JSON.parse(localStorage.getItem(verdictKey) ?? 'null') as Verdict | null; } catch { return null; }
}
async function verifyLicense(token: string, foreground = false) {
  if (!navigator.onLine) {
    if (foreground) setUnlocked(Boolean(readVerdict()?.valid), 'Offline. Reconnect to verify the saved license.');
    return;
  }
  if (foreground) byId('license-status').textContent = 'Verifying license…';
  try {
    const response = await fetch(`${apiBase}/products/${slug}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error(`verification returned ${response.status}`);
    const body = await response.json() as { valid: boolean; reason?: string };
    localStorage.setItem(verdictKey, JSON.stringify({ valid: body.valid, checkedAt: Date.now() }));
    setUnlocked(body.valid, body.valid ? 'Team-pack license active on this device.' : 'License no longer active. You can purchase or paste another token.');
  } catch {
    setUnlocked(Boolean(readVerdict()?.valid), 'Could not reach license verification. The saved verdict is unchanged; try again when connected.');
  }
}

function resumeAfterReconnect() {
  updateConnection();
  const token = localStorage.getItem(licenseKey);
  if (token) void verifyLicense(token);
}
window.addEventListener('online', resumeAfterReconnect);

const params = new URLSearchParams(window.location.search);
const returnedLicense = params.get('license');
if (returnedLicense) {
  localStorage.setItem(licenseKey, returnedLicense);
  params.delete('license');
  const query = params.toString();
  history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  setUnlocked(true, 'License received. Confirming it with Sociobot…');
  void verifyLicense(returnedLicense, true);
} else {
  const token = localStorage.getItem(licenseKey);
  const verdict = readVerdict();
  if (token && verdict?.valid) setUnlocked(true);
  if (token && (!verdict || Date.now() - verdict.checkedAt > 86_400_000)) void verifyLicense(token);
}

byId<HTMLFormElement>('license-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const token = byId<HTMLInputElement>('license-token').value.trim();
  if (!token) return;
  localStorage.setItem(licenseKey, token);
  void verifyLicense(token, true);
});

byId<HTMLButtonElement>('download-pack').addEventListener('click', () => {
  const pack = JSON.stringify({
    rules: [
      { name: 'aws-access-key-id', kind: 'AWS_KEY', pattern: '(?P<value>AKIA[0-9A-Z]{16})' },
      { name: 'kubernetes-service-token', kind: 'K8S_TOKEN', pattern: '(?i)(?:serviceaccount|service-account)[=: ]+(?P<value>[A-Za-z0-9._-]{20,})' },
      { name: 'postgres-connection-url', kind: 'PG_CREDENTIALS', pattern: 'postgres(?:ql)?://(?P<value>[^\\s/@:]+:[^\\s/@]+)@' },
      { name: 'request-correlation-id', kind: 'REQUEST_ID', pattern: '(?i)(?:x-request-id|trace[_-]?id)[=: ]+(?P<value>[a-f0-9-]{16,64})' },
    ],
    review_checklist: [
      'Name the systems and log sources this policy covers.',
      'Run the policy against representative incident logs before adopting it.',
      'Review false positives and custom values with the team that owns them.',
      'Check the manifest and share the casefile password separately.',
    ],
    note: 'Review and tailor these starters before use. No rule set guarantees complete detection.',
  }, null, 2);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([pack], { type: 'application/json' }));
  link.download = 'casefile-team-policy-pack.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => undefined));
}
