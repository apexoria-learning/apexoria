// Playwright config for Apexoria Learning end-to-end tests.
//
// IMPORTANT — Lenis smooth-scroll gotcha:
// The site keeps a permanent requestAnimationFrame loop alive
// (see src/App.js). That means Playwright's
// `page.waitForLoadState('networkidle')` will NEVER resolve.
// Use `'domcontentloaded'`, `'load'`, or explicit locator waits
// (`expect(locator).toBeVisible()`) — never `networkidle`.
// See .github/GOTCHAS.md — 2026-07-20 entry.
//
// Google Form gotcha:
// Every spec that submits LeadForm MUST intercept the POST via
// `page.route('**/formResponse*', ...)` and return a stubbed 200.
// Real submissions pollute the production Sheet. See
// e2e/utils/gfStub.js for the shared helper.

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: '../test_reports/playwright-html', open: 'never' }],
    ['json', { outputFile: '../test_reports/playwright-latest.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // To add Firefox / WebKit later, install with `npx playwright install firefox webkit`
    // and uncomment the entries below.
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari']  } },
  ],
  webServer: {
    command: 'npm start --prefix ..',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      BROWSER: 'none',
      CI: 'true',
    },
  },
});
