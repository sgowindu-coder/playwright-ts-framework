import { test as base, APIRequestContext, request } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

/**
 * Custom Fixtures
 *
 * Fixtures handle setup/teardown automatically — no beforeEach boilerplate in tests.
 * Both UI page objects and API contexts are wired in here.
 *
 * Usage in tests:
 *   import { test } from '@fixtures/index';
 *   test('my test', async ({ loginPage, apiContext }) => { ... });
 */

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

type ApiFixtures = {
  apiContext: APIRequestContext;
};

export type AppFixtures = PageFixtures & ApiFixtures;

export const test = base.extend<AppFixtures>({

  // ── UI Page Fixtures ───────────────────────────────────────────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // ── API Fixture ────────────────────────────────────────────────
  // JSONPlaceholder needs no authentication — clean context only
  apiContext: async ({}, use) => {
    const context = await request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      },
    });
    await use(context);
    await context.dispose();
  },

});

export { expect } from '@playwright/test';
