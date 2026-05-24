import { Page, Locator } from '@playwright/test';

/**
 * BasePage
 * All Page Object classes extend this.
 * Centralises common navigation, wait, and utility logic.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to a path relative to baseURL */
  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Wait for network idle — useful after form submissions */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /** Get page title */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Scroll element into view before interacting */
  async scrollTo(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /** Type slowly — useful for autocomplete fields */
  async slowType(locator: Locator, text: string, delayMs = 80): Promise<void> {
    await locator.click();
    for (const char of text) {
      await this.page.keyboard.type(char);
      await this.page.waitForTimeout(delayMs);
    }
  }

  /** Take a named screenshot — saved to test-results/ */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }
}
