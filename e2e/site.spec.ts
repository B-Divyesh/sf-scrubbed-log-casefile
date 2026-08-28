import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home is accessible and the keyboard demo works at 390px', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page).toHaveTitle(/Scrubbed Log Casefile/);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await page.locator('#raw-log').fill('user=a@example.com ip=10.0.0.4');
  await page.locator('#scrub-button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#scrubbed-output')).toContainText('<EMAIL:');
  await expect(page.locator('#scrubbed-output')).not.toContainText('a@example.com');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  expect(errors).toEqual([]);
});

for (const path of ['/privacy/', '/terms/']) {
  test(`${path} has its legal document and no serious accessibility defects`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).options({ runOnly: { type: 'tag', values: ['wcag2aa'] } }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('offline state is explicit while the local demo remains usable', async ({ page, context }) => {
  await page.goto('/');
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await expect(page.locator('#offline-bar')).toBeVisible();
  await page.locator('#scrub-button').click();
  await expect(page.locator('#demo-summary')).toContainText('replaced');
});
