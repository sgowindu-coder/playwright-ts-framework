import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage
 * Example of a post-login page — demonstrates nav, widgets, and table interactions.
 */
export class DashboardPage extends BasePage {
  readonly welcomeBanner: Locator;
  readonly navMenu: Locator;
  readonly userAvatar: Locator;
  readonly logoutButton: Locator;
  readonly dataTable: Locator;
  readonly searchInput: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeBanner   = page.getByTestId('welcome-banner');
    this.navMenu         = page.getByRole('navigation');
    this.userAvatar      = page.getByTestId('user-avatar');
    this.logoutButton    = page.getByRole('button', { name: /logout/i });
    this.dataTable       = page.getByRole('table');
    this.searchInput     = page.getByPlaceholder('Search...');
    this.loadingSpinner  = page.getByTestId('loading-spinner');
  }

  async waitForDashboardLoad(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10_000 });
    await expect(this.welcomeBanner).toBeVisible();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.page.keyboard.press('Enter');
    await this.waitForNetworkIdle();
  }

  async getTableRowCount(): Promise<number> {
    return this.dataTable.locator('tbody tr').count();
  }

  async getTableCellText(row: number, col: number): Promise<string> {
    const cell = this.dataTable.locator('tbody tr').nth(row).locator('td').nth(col);
    return (await cell.textContent()) ?? '';
  }

  async logout(): Promise<void> {
    await this.userAvatar.click();
    await this.logoutButton.click();
  }

  // ── Assertions ──────────────────────────────────────────────────

  async assertDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.welcomeBanner).toBeVisible();
  }

  async assertTableHasRows(minRows: number): Promise<void> {
    const count = await this.getTableRowCount();
    expect(count).toBeGreaterThanOrEqual(minRows);
  }
}
