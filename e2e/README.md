# Playwright End-to-End Testing

This directory contains the comprehensive end-to-end testing suite for the application using Playwright.

## Architecture

The testing framework follows the **Page Object Model (POM)** pattern for maintainable and reusable test code:

```
e2e/
├── pages/          # Page Object Model classes
│   ├── base-page.ts        # Common functionality for all pages
│   ├── login-page.ts       # Login page interactions
│   ├── registration-page.ts # Registration page interactions
│   └── admin/              # Admin-specific page objects
├── tests/          # Test specifications
│   └── auth.spec.ts        # Authentication tests
├── utils/          # Utility classes and helpers
│   └── api-client.ts       # PocketBase API interactions
├── fixtures/       # Playwright fixtures for test data
│   └── test-data.ts        # Test data management and fixtures
└── types/          # TypeScript type definitions
    └── test-types.ts       # Test-specific type definitions
```

## Getting Started

### Prerequisites

- Node.js and npm/bun installed
- PocketBase running locally on port 8090
- Application built and running on port 4173

### Install Dependencies

```bash
npm install
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests in headed mode (visible browser)
npm run test:e2e -- --headed

# Run specific test file
npm run test:e2e -- e2e/tests/auth.spec.ts

# Run tests in specific browser
npm run test:e2e -- --project=chromium

# Run tests with debugging
npm run test:e2e -- --debug
```

### Running Tests in CI

The GitHub Actions workflow automatically runs tests on pull requests. The pipeline:

1. Sets up PocketBase as a service container
2. Installs dependencies and Playwright browsers
3. Builds the application
4. Runs the full test suite
5. Uploads test reports and artifacts
6. Blocks merging if tests fail

## Test Data Management

### Fixtures

Tests use Playwright fixtures for automatic test data creation and cleanup:

```typescript
// Use the testUser fixture for tests that need a user
test('should login successfully', async ({ page, testUser }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginSuccessfully({
    email: testUser.email,
    password: testUser.password
  });
});

// Use testApiClient for API operations
test('should create user via API', async ({ testApiClient }) => {
  const user = await testApiClient.createUser({
    email: testApiClient.generateTestEmail(),
    password: testApiClient.generateTestPassword()
  });
  // User is automatically cleaned up after test
});
```

### Test Data Isolation

- Each test gets fresh, isolated test data
- Test users are automatically created and cleaned up
- No shared state between tests
- Unique email addresses generated for each test run

## Writing New Tests

### 1. Create Page Objects

For new pages, extend the `BasePage` class:

```typescript
import { BasePage } from './base-page.js';

export class MyNewPage extends BasePage {
  private readonly myButton = 'button[data-testid="my-button"]';

  async clickMyButton(): Promise<void> {
    await this.clickElement(this.myButton);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.myButton);
  }
}
```

### 2. Write Test Specifications

Create test files in the `tests/` directory:

```typescript
import { test, expect } from '../fixtures/test-data.js';
import { MyNewPage } from '../pages/my-new-page.js';

test.describe('My New Feature', () => {
  test('should perform expected action', async ({ page, testUser }) => {
    const myPage = new MyNewPage(page);
    
    await myPage.navigate();
    await myPage.assertPageLoaded();
    await myPage.clickMyButton();
    
    // Add assertions
    await expect(page).toHaveURL(/expected-url/);
  });
});
```

### 3. Follow Testing Best Practices

- **Use descriptive test names** that explain what is being tested
- **Test both happy paths and error cases**
- **Keep tests independent** - don't rely on other tests
- **Use page objects** for all UI interactions
- **Add proper assertions** to verify expected behavior
- **Handle async operations** properly with awaits

## Test Categories

### Authentication Tests (`auth.spec.ts`)
- User registration (success and validation errors)
- User login (success, failure, rate limiting)
- Password reset flow
- Form validation and error handling
- Navigation between auth pages

### Subscription Tests (Planned)
- Plan selection and checkout
- Subscription activation
- Plan changes and upgrades
- Subscription cancellation
- Billing history

### Admin Tests (Planned)
- Admin authentication
- Customer management
- Billing oversight
- Plan management

### Content Tests (Planned)
- Static page navigation
- Contact forms
- Marketing pages
- Responsive design

## Configuration

### Playwright Configuration (`playwright.config.ts`)

- **Multi-browser testing**: Chromium, Firefox, WebKit
- **Base URL**: http://localhost:4173
- **Timeouts**: Configured for CI/CD environments
- **Retries**: 2 retries on CI, 0 locally
- **Artifacts**: Screenshots and videos on failure
- **Reports**: HTML reports generated

### Environment Variables

Set these in `.env` for local testing or in CI configuration:

```bash
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=admin123456
```

## Debugging Tests

### Local Debugging

```bash
# Run with visible browser
npm run test:e2e -- --headed

# Run in debug mode (step through)
npm run test:e2e -- --debug

# Run specific test with debugging
npm run test:e2e -- --debug -g "should login successfully"
```

### CI Debugging

When tests fail in CI:

1. Check the GitHub Actions logs
2. Download the test artifacts (screenshots, videos, reports)
3. Review the HTML report for detailed failure information
4. Check the test-results directory for traces

### Common Issues

- **Element not found**: Check selectors and wait conditions
- **Timing issues**: Add proper waits (`waitForLoadState`, `waitFor`)
- **Test data conflicts**: Ensure proper cleanup in fixtures
- **Network issues**: Check if services are running correctly

## Contributing

1. Write tests for new features
2. Update page objects when UI changes
3. Add proper error handling and assertions
4. Follow the existing code style and patterns
5. Ensure tests pass locally before submitting PRs

## Performance

- Tests run in parallel by default
- Each test is isolated with fresh data
- CI runs are optimized for speed and reliability
- Artifacts are collected for debugging failed tests 