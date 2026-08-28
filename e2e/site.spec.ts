import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { basename, dirname } from 'node:path';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('cold first screen names engineers and has one sample-data action', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Scrub incident logs before sharing');
  await expect(page.locator('.lede')).toContainText('engineers');
  await expect(page.locator('.hero .button')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  for (const fact of await page.locator('.trust-strip li').all()) {
    const box = await fact.boundingBox();
    expect(box?.y ?? Infinity).toBeGreaterThanOrEqual(0);
    expect((box?.y ?? Infinity) + (box?.height ?? 0)).toBeLessThanOrEqual(844);
  }
});

test('plain-language sample, replacement, and license wording stays consistent', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-actions')).toContainText('Opens a ready sample. Nothing is saved.');
  await expect(page.locator('.hero-art figcaption')).toContainText('SAMPLE REDACTED LOG');
  await expect(page.locator('.hero-art figcaption')).toContainText('Repeated values get matching replacements.');
  await expect(page.locator('.hero-art').evaluate((figure) => getComputedStyle(figure, '::before').content)).resolves.toBe('"SAMPLE REDACTED LOG"');
  await expect(page.locator('#load-sample')).toHaveText('Load sample');
  await page.locator('#raw-log').fill('');
  await page.getByRole('button', { name: 'Scrub this fragment' }).click();
  await expect(page.locator('#demo-summary')).toHaveText('Paste a log fragment or load the sample, then try again.');
  await expect(page.locator('.price-card').first().locator('.stamp')).toHaveText('FREE CLI');

  await page.route('https://api.sociobot.in/api/v1/products/scrubbed-log-casefile/verify?license=copy-failure-license', (route) => route.abort());
  await page.goto('/?license=copy-failure-license');
  await expect(page.locator('#license-status')).toHaveText('Could not reach license verification. Your last license status is unchanged. Try again when connected.');

  await page.goto('/demo/');
  await expect(page.locator('#demo-ready-summary')).toContainText('A new demo uses different replacements.');

  const readme = readFileSync('README.md', 'utf8');
  expect(readme).toContain('Repeated values match within one demo page. A new page uses different\nreplacements.');
  expect(readme).toContain('A second\ncasefile uses different replacements.');
  expect(readme).toContain('one-way file fingerprint that differs between\ncasefiles');
  expect(readme).not.toMatch(/fresh in-memory salt|correlated|salted fingerprint/i);
});

test('@claim:browser-local landing and demo scrub without sending or saving input and every route loads no tracking resources', async ({ page }) => {
  const requests: { url: string; postData: string | null }[] = [];
  page.on('request', (request) => requests.push({ url: request.url(), postData: request.postData() }));
  const landingSentinel = 'landing-private-sentinel-9f1e@example.com';
  await page.goto('/');
  await page.locator('#raw-log').fill(`email=${landingSentinel} password=landing-secret-9f1e`);
  await page.getByRole('button', { name: 'Scrub this fragment' }).click();
  await expect(page.locator('#scrubbed-output')).not.toContainText(landingSentinel);
  const realStorage = {
    'sb_license:scrubbed-log-casefile': 'real-license-do-not-touch',
    'sb_license_verdict:scrubbed-log-casefile': JSON.stringify({ valid: false, checkedAt: 0 }),
    'casefile:real-workspace': 'real-data-do-not-touch',
  };
  await page.evaluate((entries) => {
    for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value);
  }, realStorage);

  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForURL('/demo/');
  await expect(page).toHaveTitle('Demo — Scrubbed Log Casefile');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('#scrubbed-output')).toContainText('<SECRET:');
  await expect(page.locator('#scrubbed-output')).not.toContainText('json-demo-password');
  const demoSentinel = 'demo-private-sentinel-7a2c@example.com';
  await page.locator('#raw-log').fill(`email=${demoSentinel} password=demo-secret-7a2c`);
  await page.getByRole('button', { name: 'Scrub this fragment' }).click();
  await expect(page.locator('#scrubbed-output')).not.toContainText(demoSentinel);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#raw-log')).toHaveValue(/ria@example\.com/);

  for (const route of ['/privacy/', '/terms/', '/404.html']) await page.goto(route);
  const sentinels = [landingSentinel, demoSentinel, 'landing-secret-9f1e', 'demo-secret-7a2c'];
  expect(await page.evaluate(async (values) => {
    const cacheContents = await Promise.all((await caches.keys()).map(async (name) => {
      const cache = await caches.open(name);
      return Promise.all((await cache.keys()).map(async (request) => (await cache.match(request))?.text() ?? ''));
    }));
    return {
      local: Object.fromEntries(Object.entries(localStorage)),
      session: sessionStorage.length,
      databases: await indexedDB.databases(),
      cachedSentinel: cacheContents.flat().some((body) => values.some((value) => body.includes(value))),
    };
  }, sentinels)).toEqual({ local: realStorage, session: 0, databases: [], cachedSentinel: false });
  expect(requests.every((request) => new URL(request.url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(requests.some((request) => sentinels.some((value) => request.url.includes(value) || request.postData?.includes(value)))).toBe(false);
});

test('@claim:browser-redaction browser demo replaces every stated class, matches repeats on one page, and changes replacements on a new page', async ({ page, context }) => {
  const input = 'email=same@example.com again=same@example.com ip=10.9.8.7 password=browser-secret Authorization: Bearer browser-bearer-123 jwt=eyJabcdefgh.abcdefgh.abcdefgh';
  await page.goto('/demo/');
  await page.locator('#raw-log').fill(input);
  await page.getByRole('button', { name: 'Scrub this fragment' }).click();
  const first = await page.locator('#scrubbed-output').textContent() ?? '';
  for (const value of ['same@example.com', '10.9.8.7', 'browser-secret', 'browser-bearer-123', 'eyJabcdefgh.abcdefgh.abcdefgh']) expect(first).not.toContain(value);
  expect(first).toMatch(/<EMAIL:[A-F0-9]{8}>/);
  expect(first).toMatch(/<IPV4:[A-F0-9]{8}>/);
  expect(first).toMatch(/<SECRET:[A-F0-9]{8}>/);
  expect(first).toMatch(/<AUTH:[A-F0-9]{8}>/);
  expect(first).toMatch(/<JWT:[A-F0-9]{8}>/);
  const firstEmails = first.match(/<EMAIL:[A-F0-9]{8}>/g) ?? [];
  expect(firstEmails).toHaveLength(2);
  expect(new Set(firstEmails).size).toBe(1);

  const freshPage = await context.newPage();
  await freshPage.goto('/demo/');
  await freshPage.locator('#raw-log').fill(input);
  await freshPage.getByRole('button', { name: 'Scrub this fragment' }).click();
  const second = await freshPage.locator('#scrubbed-output').textContent() ?? '';
  expect(second.match(/<EMAIL:[A-F0-9]{8}>/)?.[0]).not.toBe(firstEmails[0]);
  await freshPage.close();
});

test('@claim:license-storage saves a returned license locally and verifies it only with Sociobot', async ({ page }) => {
  const verificationUrls: string[] = [];
  await page.route('https://api.sociobot.in/api/v1/products/scrubbed-log-casefile/verify?license=fixture-license', async (route) => {
    verificationUrls.push(route.request().url());
    await route.fulfill({
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': 'http://127.0.0.1:4173' },
      body: JSON.stringify({ valid: true, reason: 'ok' }),
    });
  });
  await page.goto('/?license=fixture-license');
  await expect(page).toHaveURL('/');
  await expect(page.locator('#license-status')).toContainText('active');
  expect(await page.evaluate(() => ({
    license: localStorage.getItem('sb_license:scrubbed-log-casefile'),
    verdict: JSON.parse(localStorage.getItem('sb_license_verdict:scrubbed-log-casefile') ?? '{}').valid,
  }))).toEqual({ license: 'fixture-license', verdict: true });
  expect(verificationUrls).toEqual(['https://api.sociobot.in/api/v1/products/scrubbed-log-casefile/verify?license=fixture-license']);
  expect(await page.evaluate(() => {
    localStorage.clear();
    return [localStorage.getItem('sb_license:scrubbed-log-casefile'), localStorage.getItem('sb_license_verdict:scrubbed-log-casefile')];
  })).toEqual([null, null]);
});

test('@claim:license-reconnect reconnecting resumes verification of a saved license', async ({ page, context }) => {
  const endpoint = 'https://api.sociobot.in/api/v1/products/scrubbed-log-casefile/verify?license=reconnect-license';
  const calls: string[] = [];
  await page.route(endpoint, async (route) => {
    calls.push(route.request().url());
    await route.fulfill({
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': 'http://127.0.0.1:4173' },
      body: JSON.stringify({ valid: true, reason: 'ok' }),
    });
  });
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.evaluate(() => {
    localStorage.setItem('sb_license:scrubbed-log-casefile', 'reconnect-license');
    localStorage.setItem('sb_license_verdict:scrubbed-log-casefile', JSON.stringify({ valid: false, checkedAt: 0 }));
  });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#offline-bar')).toBeVisible();
  expect(calls).toEqual([]);
  await context.setOffline(false);
  await expect.poll(() => calls.length).toBe(1);
  await expect(page.locator('#license-status')).toContainText('active');
  expect(calls).toEqual([endpoint]);
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
  for (const link of await page.locator('footer nav a').all()) {
    expect((await link.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect((await link.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  for (const link of await page.locator('header nav a').all()) {
    expect((await link.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect((await link.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  await page.evaluate(() => document.documentElement.classList.add('text-scale-200'));
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`hero evidence and caption stay within the ${viewport.width}px viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const bounds = await page.locator('.hero-art').evaluate((figure) => {
      const box = figure.getBoundingClientRect();
      const image = figure.querySelector('img')?.getBoundingClientRect();
      const caption = figure.querySelector('figcaption')?.getBoundingClientRect();
      const stamp = getComputedStyle(figure, '::before');
      const stampRight = Number.parseFloat(stamp.right);
      return { box, image, caption, stampRight, width: innerWidth };
    });
    for (const rectangle of [bounds.box, bounds.image, bounds.caption]) {
      expect(rectangle?.left ?? -1).toBeGreaterThanOrEqual(0);
      expect(rectangle?.right ?? Infinity).toBeLessThanOrEqual(viewport.width);
    }
    expect(bounds.stampRight).toBeGreaterThanOrEqual(0);
  });
}

test('the ?demo=1 entry point opens the isolated demo with its banner and reset control', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?demo=1');
  await expect(page).toHaveURL('/demo/');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  const readyBounds = await page.locator('#demo-ready-output').boundingBox();
  const summaryBounds = await page.locator('#demo-ready-summary').boundingBox();
  expect(await page.locator('#demo-ready-output').textContent()).toMatch(/<EMAIL:[A-F0-9]{8}>/);
  expect(await page.locator('#demo-ready-output').textContent()).toMatch(/<SECRET:[A-F0-9]{8}>/);
  expect((readyBounds?.y ?? Infinity) + (readyBounds?.height ?? 0)).toBeLessThanOrEqual(844);
  expect((summaryBounds?.y ?? Infinity) + (summaryBounds?.height ?? 0)).toBeLessThanOrEqual(844);
});

test('normal routes keep navigation, announce the destination, and focus its h1 on forward and back', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header nav a')).toHaveText(['Demo', 'How it works', 'Install', 'Privacy']);
  await page.locator('footer').getByRole('link', { name: 'Terms' }).click();
  await expect(page).toHaveURL('/terms/');
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('#route-announcer')).toContainText('Terms — Scrubbed Log Casefile');
  await page.locator('.wordmark').click();
  await expect(page).toHaveURL('/');
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('#route-announcer')).toContainText('Scrubbed Log Casefile — scrub logs before sharing');
  await page.locator('header').getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL('/privacy/');
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('#route-announcer')).toContainText('Privacy — Scrubbed Log Casefile');
  await page.locator('footer').getByRole('link', { name: 'Terms' }).click();
  await expect(page).toHaveURL('/terms/');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL('/privacy/');
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('#route-announcer')).toContainText('Privacy — Scrubbed Log Casefile');
});

for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
  test(`${path} has route metadata and no serious accessibility defects`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).options({ runOnly: { type: 'tag', values: ['wcag2aa'] } }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('unknown routes return the designed 404 response', async ({ page }) => {
  const response = await page.goto('/not-a-real-casefile-route');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Scrubbed Log Casefile');
  await expect(page.locator('h1')).toHaveText('That page is not here.');
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

test('@claim:team-policy-pack cached valid license downloads four policy starters and a review checklist', async ({ page }) => {
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
  expect(pack.review_checklist).toEqual([
    'Name the systems and log sources this policy covers.',
    'Run the policy against representative incident logs before adopting it.',
    'Review false positives and custom values with the team that owns them.',
    'Check the manifest and share the casefile password separately.',
  ]);
  expect(pack.note).toContain('No rule set guarantees complete detection');
  await expect(page.locator('#buy-link')).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/scrubbed-log-casefile/checkout');
});

test('@claim:cli-recording landing page includes the self-hosted real CLI demo recording', async ({ page, request }) => {
  await page.goto('/');
  const recording = page.getByRole('img', { name: 'Terminal recording of casefile demo creating an encrypted sample casefile' });
  await expect(recording).toHaveAttribute('src', '/assets/casefile-demo.svg');
  expect((await request.get('/assets/casefile-demo.svg')).status()).toBe(200);
  const transcript = execFileSync('cargo', ['run', '--quiet', '--', 'demo'], { encoding: 'utf8' });
  const summary = transcript.match(/Demo casefile: (.+)\n[\s\S]*Sealed (\d+) files after (\d+) redactions\./);
  expect(summary).not.toBeNull();
  const svg = readFileSync('site/public/assets/casefile-demo.svg', 'utf8');
  expect(svg).toContain(`Sealed ${summary?.[2]} files after ${summary?.[3]} redactions.`);
  rmSync(dirname(summary?.[1] ?? ''), { recursive: true, force: true });
});

test('@claim:cli-demo bundled CLI demo creates a new sample directory and prints every review detail', () => {
  const body = JSON.parse(execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--json'], { encoding: 'utf8' }));
  expect(body.ok).toBe(true);
  expect(body.files_written).toBe(2);
  expect(body.redactions).toBeGreaterThanOrEqual(7);
  expect(body.password).toBe('casefile-demo-password');
  expect(basename(body.output)).toBe('sample.casefile.zip');
  expect(dirname(body.output)).toBe(dirname(body.sample_directory));
  expect(basename(dirname(body.output))).toMatch(/^casefile-demo-/);
  expect(existsSync(body.output)).toBe(true);
  expect(existsSync(body.sample_directory)).toBe(true);
  rmSync(dirname(body.output), { recursive: true });

  const human = execFileSync('cargo', ['run', '--quiet', '--', 'demo'], { encoding: 'utf8' });
  const output = human.match(/^Demo casefile: (.+)$/m)?.[1] ?? '';
  const sample = human.match(/^Sample input: (.+)$/m)?.[1] ?? '';
  expect(output).not.toBe('');
  expect(sample).not.toBe('');
  expect(human).toContain('Casefile password: casefile-demo-password');
  expect(human).toMatch(/Sealed 2 files after \d+ redactions/);
  expect(dirname(output)).toBe(dirname(sample));
  rmSync(dirname(output), { recursive: true });
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
test('@claim:aes-256 observable CLI contract passes', () => {
  expectRustContract('archive_uses_aes_256_encryption');
});
test('@claim:password-env observable CLI contract passes', () => {
  expectRustContract('password_is_read_from_an_environment_variable_not_a_cli_argument');
});
test('@claim:machine-json observable CLI contract passes', () => {
  expectRustContract('json_flag_covers_success_validation_and_parse_errors');
});
test('@claim:exit-codes observable CLI contract passes', () => {
  expectRustContract('documented_exit_codes_cover_success_validation_and_runtime_failure');
});
test('@claim:custom-rules observable CLI contract passes', () => {
  expectRustContract('documented_custom_policy_replaces_only_the_named_value_capture');
});
test('@claim:stable-tokens observable CLI contract passes', () => {
  expectRustContract('separate_cli_casefiles_use_fresh_salts_and_stable_tokens');
});
test('@claim:manifest-contents observable CLI contract passes', () => {
  expectRustContract('manifest_has_salted_fingerprints_rule_names_counts_and_no_values');
});
test('@claim:inspect-casefile observable CLI contract passes', () => {
  expectRustContract('inspect_displays_manifest_and_extracts_scrubbed_files_safely');
});
test('@claim:atomic-output observable CLI contract passes', () => {
  expectRustContract('existing_output_is_unchanged_and_failed_pack_leaves_no_temporary_archive');
});

test('@claim:single-binary MIT package exposes one CLI binary', () => {
  const metadata = JSON.parse(execFileSync('cargo', ['metadata', '--no-deps', '--format-version', '1'], { encoding: 'utf8' }));
  const product = metadata.packages.find((item: { name: string }) => item.name === 'scrubbed-log-casefile');
  expect(product.license).toBe('MIT');
  expect(product.targets.filter((target: { kind: string[] }) => target.kind.includes('bin')).map((target: { name: string }) => target.name)).toEqual(['casefile']);
});

test('@claim:cli-local package contains no network or telemetry client', () => {
  const metadata = JSON.parse(execFileSync('cargo', ['metadata', '--no-deps', '--format-version', '1'], { encoding: 'utf8' }));
  const product = metadata.packages.find((item: { name: string }) => item.name === 'scrubbed-log-casefile');
  const names = product.dependencies.map((item: { name: string }) => item.name);
  expect(names).not.toEqual(expect.arrayContaining(['reqwest', 'hyper', 'ureq', 'curl', 'sentry', 'opentelemetry']));
  expect(readFileSync('src/main.rs', 'utf8')).not.toMatch(/TcpStream|UdpSocket|std::net/);
});
