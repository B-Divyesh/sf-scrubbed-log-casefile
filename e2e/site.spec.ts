import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('cold first screen names engineers and has one sample-data action', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Scrub incident logs before sharing');
  await expect(page.locator('.lede')).toContainText('engineers');
  await expect(page.locator('.hero .button')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
});

test('@claim:browser-local demo is ready in one click and keeps input ephemeral', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo/');
  await expect(page).toHaveTitle('Demo — Scrubbed Log Casefile');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('#scrubbed-output')).toContainText('<SECRET:');
  await expect(page.locator('#scrubbed-output')).not.toContainText('json-demo-password');
  await page.locator('#raw-log').fill('email=changed@example.com');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#raw-log')).toHaveValue(/ria@example\.com/);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:offline-reload reloads the interactive demo without HTTP cache', async ({ page, context }) => {
  await page.goto('/demo/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  const session = await context.newCDPSession(page);
  await session.send('Network.enable');
  await session.send('Network.clearBrowserCache');
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle('Demo — Scrubbed Log Casefile');
  await page.locator('#raw-log').fill('user=offline@example.com');
  await page.locator('#scrub-button').click();
  await expect(page.locator('#scrubbed-output')).toContainText('<EMAIL:');
});

test('service worker precaches built assets with a content version', async ({ request }) => {
  const worker = await (await request.get('/sw.js')).text();
  expect(worker).toMatch(/casefile-shell-[a-f0-9]{12}/);
  expect(worker).toMatch(/\/assets\/[^"']+\.js/);
  expect(worker).toMatch(/\/assets\/[^"']+\.css/);
  expect(worker).toContain('/demo/');
  expect(worker).not.toContain('casefile-shell-v1');
});

test('keyboard, 200% text, touch targets, and accessibility pass at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.evaluate(() => document.documentElement.classList.add('text-scale-200'));
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  for (const link of await page.locator('footer nav a').all()) {
    expect((await link.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
  test(`${path} has route metadata and no serious accessibility defects`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).options({ runOnly: { type: 'tag', values: ['wcag2aa'] } }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('unknown routes return the designed 404 response', async ({ page }) => {
  const response = await page.goto('/not-a-real-casefile-route');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Scrubbed Log Casefile');
  await expect(page.locator('h1')).toHaveText('That case is not here.');
});

test('deployment policy declares security, cache, MIME, and 404 behavior', () => {
  const policy = JSON.parse(readFileSync('site/public/staticwebapp.config.json', 'utf8'));
  expect(policy.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
  expect(policy.globalHeaders['Permissions-Policy']).toContain('camera=()');
  expect(policy.globalHeaders['X-Frame-Options']).toBe('DENY');
  expect(policy.routes[0].headers['Cache-Control']).toContain('immutable');
  expect(policy.routes[1].headers['Cache-Control']).toBe('no-cache');
  expect(policy.mimeTypes['.webmanifest']).toBe('application/manifest+json');
  expect(policy.responseOverrides['404'].statusCode).toBe(404);
});

test('@claim:team-policy-pack cached valid license downloads four policy starters', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:scrubbed-log-casefile', 'cached-license');
    localStorage.setItem('sb_license_verdict:scrubbed-log-casefile', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.goto('/');
  await expect(page.locator('.price-card.paid .price')).toContainText('$19');
  await expect(page.locator('.price-card.paid .price')).toContainText('once');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download policy pack' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  let text = '';
  for await (const chunk of stream) text += chunk.toString();
  const pack = JSON.parse(text);
  expect(pack.rules.map((rule: { name: string }) => rule.name)).toEqual([
    'aws-access-key-id', 'kubernetes-service-token', 'postgres-connection-url', 'request-correlation-id',
  ]);
});

test('@claim:cli-demo bundled CLI demo creates sample input and an archive', () => {
  const body = JSON.parse(execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--json'], { encoding: 'utf8' }));
  expect(body.ok).toBe(true);
  expect(body.files_written).toBe(2);
  expect(body.redactions).toBeGreaterThanOrEqual(7);
  rmSync(new URL(`file://${body.output}`).pathname.split('/sample.casefile.zip')[0], { recursive: true });
});

function expectRustContract(testName: string) {
  expect(() => execFileSync('cargo', ['test', testName, '--quiet'], { stdio: 'pipe' })).not.toThrow();
}

test('@claim:credential-redaction observable CLI contract passes', () => {
  expectRustContract('encrypted_archive_scrubs_standard_json_and_yaml_credentials');
});
test('@claim:encrypted-casefile observable CLI contract passes', () => {
  expectRustContract('encrypted_entries_decrypt_to_scrubbed_content_and_manifest');
});
test('@claim:machine-json observable CLI contract passes', () => {
  expectRustContract('json_flag_covers_command_line_parse_errors');
});
test('@claim:custom-rules observable CLI contract passes', () => {
  expectRustContract('documented_custom_policy_replaces_only_the_named_value_capture');
});
test('@claim:stable-tokens observable CLI contract passes', () => {
  expectRustContract('repeated_values_get_stable_tokens');
});
test('@claim:atomic-output observable CLI contract passes', () => {
  expectRustContract('existing_output_is_unchanged_and_failed_pack_leaves_no_temporary_archive');
});

test('@claim:single-binary package exposes one CLI binary', () => {
  const metadata = JSON.parse(execFileSync('cargo', ['metadata', '--no-deps', '--format-version', '1'], { encoding: 'utf8' }));
  const product = metadata.packages.find((item: { name: string }) => item.name === 'scrubbed-log-casefile');
  expect(product.targets.filter((target: { kind: string[] }) => target.kind.includes('bin')).map((target: { name: string }) => target.name)).toEqual(['casefile']);
});

test('@claim:cli-local package contains no network or telemetry client', () => {
  const metadata = JSON.parse(execFileSync('cargo', ['metadata', '--no-deps', '--format-version', '1'], { encoding: 'utf8' }));
  const product = metadata.packages.find((item: { name: string }) => item.name === 'scrubbed-log-casefile');
  const names = product.dependencies.map((item: { name: string }) => item.name);
  expect(names).not.toEqual(expect.arrayContaining(['reqwest', 'hyper', 'ureq', 'curl', 'sentry', 'opentelemetry']));
  expect(readFileSync('src/main.rs', 'utf8')).not.toMatch(/TcpStream|UdpSocket|std::net/);
});
