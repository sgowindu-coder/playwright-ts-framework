import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * Supports multi-environment via BASE_URL env var
 * Run:  BASE_URL=https://the-internet.herokuapp.com/login npx playwright test
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,        // Fail CI if test.only is left in
  retries: process.env.CI ? 2 : 0,     // Retry on CI only
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],                           // Clean console output
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com/login',
    trace: 'on-first-retry',           // Trace only on retry — keeps runs fast
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    // ── UI Projects ──────────────────────────────────────────────
    {
      name: 'chromium',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Pixel 5'] },
    },

    // ── API Project (no browser needed) ──────────────────────────
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { baseURL: process.env.API_BASE_URL || 'https://reqres.in' },
    },
  ],
});
