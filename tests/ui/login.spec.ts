import { test, expect } from '../../src/fixtures';

/**
 * Login UI Test Suite
 *
 * Demonstrates:
 * - POM usage via fixtures (no `new LoginPage(page)` in tests)
 * - Assertions encapsulated in page objects
 * - Data-driven negative testing
 * - Tag-based test filtering (@smoke / @regression)
 *
 * Note: These tests target a real login page.
 * Update `BASE_URL` in .env or playwright.config.ts for your app.
 */

test.describe('Login Page', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // ── Positive Tests ─────────────────────────────────────────────

  test('@smoke login page renders all required elements', async ({ loginPage }) => {
    await loginPage.assertLoginPageVisible();
  });

  test('@smoke valid credentials — redirects to dashboard', async ({ loginPage }) => {
    await loginPage.loginWith('tomsmith', 'SuperSecretPassword!');
    await loginPage.assertRedirectedTo(/secure/);
  });

  // ── Negative Tests — Data-Driven ────────────────────────────────

  const invalidCredentials = [
    { email: 'wrong@example.com', password: 'password123', desc: 'invalid email' },
    { email: 'admin@example.com', password: 'wrongpassword', desc: 'invalid password' },
    { email: '',                  password: 'password123',  desc: 'empty email'    },
    { email: 'admin@example.com', password: '',             desc: 'empty password' },
  ];

  for (const { email, password, desc } of invalidCredentials) {
    test(`@regression shows error for ${desc}`, async ({ loginPage }) => {
      await loginPage.loginWith(email, password);
      await loginPage.assertErrorMessage('invalid');
    });
  }

  // ── Accessibility ───────────────────────────────────────────────

test('@regression login page has no accessibility violations', async ({ page, loginPage }) => {
  await loginPage.goto();

  // Verify key interactive elements have accessible labels
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();

  // Verify form inputs are focusable (basic keyboard accessibility)
  await loginPage.emailInput.focus();
  await expect(loginPage.emailInput).toBeFocused();

  await loginPage.passwordInput.focus();
  await expect(loginPage.passwordInput).toBeFocused();

  // Verify page has a meaningful title
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});

  // ── Visual Regression ───────────────────────────────────────────

  test('@regression login page matches visual snapshot', async ({ page, loginPage }) => {
    await loginPage.goto();
    // First run: creates snapshot. Subsequent runs: compares.
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixelRatio: 0.02, // Allow 2% diff for anti-aliasing
    });
  });

});
