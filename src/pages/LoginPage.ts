import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage
 * Demonstrates POM pattern: locators as readonly properties,
 * actions as async methods, assertions encapsulated in the page.
 */
export class LoginPage extends BasePage {
  // ── Locators ────────────────────────────────────────────────────
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput       = page.getByLabel('Email');
    this.passwordInput    = page.getByLabel('Password');
    this.loginButton      = page.getByRole('button', { name: /sign in/i });
    this.errorMessage     = page.getByRole('alert');
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
  }

  // ── Actions ─────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/login');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /** High-level composite action used by most tests */
  async loginWith(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  // ── Assertions ──────────────────────────────────────────────────

  async assertLoginPageVisible(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async assertErrorMessage(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }

  async assertRedirectedTo(urlPattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(urlPattern);
  }
}
