# Playwright TypeScript Framework
![Playwright Tests](https://github.com/sgowindu-coder/playwright-ts-framework/actions/workflows/playwright.yml/badge.svg)

Enterprise-grade test automation framework built with Playwright and TypeScript. Demonstrates production patterns used in financial services QE: Page Object Model, API testing with `APIRequestContext`, custom fixtures, and GitHub Actions CI/CD.

## Framework Architecture

```
playwright-ts-framework/
├── src/
│   ├── pages/              # Page Object Model classes
│   │   ├── BasePage.ts     # Abstract base — all pages extend this
│   │   ├── LoginPage.ts
│   │   └── DashboardPage.ts
│   ├── fixtures/
│   │   └── index.ts        # Custom fixtures — wires POM into tests
│   ├── utils/
│   │   └── ApiClient.ts    # Reusable API wrapper with assertion helpers
│   └── data/
│       └── testData.ts     # Centralised test data and schemas
├── tests/
│   ├── ui/
│   │   └── login.spec.ts   # UI tests using POM via fixtures
│   └── api/
│       └── users.spec.ts   # API CRUD + auth tests
├── .github/workflows/
│   └── playwright.yml      # CI: smoke on PR, regression on merge
├── playwright.config.ts    # Multi-project, multi-env config
└── tsconfig.json
```

## Key Patterns

| Pattern | Where | Why |
|---|---|---|
| Page Object Model | `src/pages/` | Decouples locators from test logic |
| Custom Fixtures | `src/fixtures/index.ts` | Zero boilerplate in test files |
| APIRequestContext | `src/utils/ApiClient.ts` | Native Playwright API — no extra libraries |
| Schema Validation | `ApiClient.assertSchema()` | Catches contract breaks early |
| Tag-based filtering | `@smoke` / `@regression` | Optimises CI pipeline cost |
| Data-driven tests | `login.spec.ts` | Covers edge cases without duplication |
| Environment config | `.env` + `playwright.config.ts` | Same suite runs against any environment |

## Getting Started

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Copy environment config
cp .env.example .env
```

## Running Tests

```bash
# All tests
npm test

# API tests only (no browser needed — fast)
npm run test:api

# UI tests only
npm run test:ui

# Smoke tests only (for PR validation)
npx playwright test --grep @smoke

# Specific browser
npx playwright test --project=firefox

# Debug mode (opens Playwright Inspector)
npm run test:debug

# View HTML report
npm run test:report
```

## Running Against a Different Environment

```bash
# Staging
BASE_URL=https://staging.yourapp.com API_BASE_URL=https://api-staging.yourapp.com npm test

# Production smoke
BASE_URL=https://yourapp.com npx playwright test --grep @smoke
```

## CI/CD Pipeline

| Trigger | What Runs | Browsers |
|---|---|---|
| Pull Request | `@smoke` tests | Chromium + API |
| Merge to `main` | Full regression | Chromium, Firefox, API |
| Nightly (2 AM UTC) | Full regression | Chromium, Firefox, API |
| Manual dispatch | Configurable | Configurable |

Test reports are published to GitHub Pages after each main branch run.

## Tech Stack

- **[Playwright](https://playwright.dev/)** v1.44 — test runner, browser automation, API testing
- **TypeScript** v5.4 — strict mode enabled
- **Node.js** v20 LTS
- **GitHub Actions** — CI/CD with matrix strategy

## Author

[Your Name] — Senior SDET | [LinkedIn](https://linkedin.com/in/yourprofile) | [Email](mailto:you@example.com)
