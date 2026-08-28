import './styles.css';
import './route-focus';
import { createCaseSalt, scrubPreview } from './demo';

const sample = `2026-08-28T07:42:16Z ERROR login failed user=ria@example.com ip=10.2.3.44
2026-08-28T07:42:17Z WARN retry user=ria@example.com
"password": "json-demo-password"
"api_key": "json-demo-api-key"
Authorization: Bearer demo-bearer-token-1842`;
const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const rawLog = byId<HTMLTextAreaElement>('raw-log');
const output = byId<HTMLElement>('scrubbed-output');
const summary = byId<HTMLElement>('demo-summary');
const readyOutput = byId<HTMLElement>('demo-ready-output');
const readySummary = byId<HTMLElement>('demo-ready-summary');
let demoSalt = createCaseSalt();

function render() {
  const result = scrubPreview(rawLog.value, demoSalt);
  output.textContent = result.text;
  const total = Object.values(result.counts).reduce((sum, count) => sum + count, 0);
  summary.textContent = `${total} sensitive values replaced. The same value keeps one replacement in this demo case.`;
  const readyResult = scrubPreview('user=ria@example.com again=ria@example.com password=json-demo-password', demoSalt);
  readyOutput.textContent = readyResult.text;
  readySummary.textContent = `${total} sample values replaced. Fresh in-memory salt for this demo case.`;
}
function reset(newSalt = false) { if (newSalt) demoSalt = createCaseSalt(); rawLog.value = sample; render(); }
byId<HTMLButtonElement>('scrub-button').addEventListener('click', render);
byId<HTMLButtonElement>('reset-demo').addEventListener('click', () => { reset(true); rawLog.focus(); });
byId<HTMLButtonElement>('copy-output').addEventListener('click', async (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  try {
    await navigator.clipboard.writeText(output.textContent ?? '');
    button.textContent = 'Copied';
    window.setTimeout(() => { button.textContent = 'Copy result'; }, 1500);
  } catch { summary.textContent = 'Copy was blocked. Select the result and copy it manually.'; }
});
reset();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => undefined));
