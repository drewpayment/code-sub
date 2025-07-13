import { test, expect } from '@playwright/test';
import { TestApiClient } from '../utils/api-client.js';
import type { TestUser, TestPlan } from '../types/test-types.js';

test.describe('One-Time Invoice Management', () => {
	let apiClient: TestApiClient;
	let testUser: TestUser;
	let testProjectPlan: TestPlan;
	let adminUser: TestUser;

	test.beforeAll(async () => {
		apiClient = new TestApiClient();
		
		// Create a test customer with Stripe integration
		testUser = await apiClient.createUser({
			email: apiClient.generateTestEmail('invoice-customer'),
			password: apiClient.generateTestPassword(),
			username: 'Invoice Test Customer',
			verified: true
		});

		// Create an admin user for testing
		adminUser = await apiClient.createUser({
			email: apiClient.generateTestEmail('admin'),
			password: apiClient.generateTestPassword(),
			username: 'Test Admin',
			verified: true
		});

		// Create a test one-time project plan
		testProjectPlan = await apiClient.createPlan({
			name: 'Test Website Project',
			description: 'A test one-time website project for E2E testing',
			price: 1500, // This will be price_min in the actual implementation
			interval: 'month', // Use valid interval for the API
			stripePriceId: `price_test_${Date.now()}`,
			features: [
				'Custom website design',
				'Responsive layout',
				'SEO optimization',
				'Contact form integration'
			],
			active: true
		});
	});

	test.afterAll(async () => {
		// Cleanup test data
		if (testUser?.id) {
			await apiClient.cleanupUserData(testUser.id);
		}
		if (adminUser?.id) {
			await apiClient.cleanupUserData(adminUser.id);
		}
		if (testProjectPlan?.id) {
			await apiClient.deletePlan(testProjectPlan.id);
		}
	});

	test.describe('Admin Invoice Creation Flow', () => {
		test('should create and send one-time invoice successfully', async ({ page }) => {
			// Step 1: Log in as admin user
			await page.goto('/login');
			await page.fill('input[name="email"]', adminUser.email);
			await page.fill('input[name="password"]', adminUser.password);
			await page.click('button[type="submit"]');
			
			// Wait for successful login redirect
			await page.waitForURL('**/admin**');
			await expect(page.locator('h1:has-text("Admin")')).toBeVisible();

			// Step 2: Navigate to specific customer's detail page
			await page.goto(`/admin/customers/${testUser.id}`);
			await page.waitForLoadState('networkidle');

			// Verify we're on the customer detail page
			await expect(page.locator('h1', { hasText: testUser.username || testUser.email })).toBeVisible();

			// Step 3: Locate the "Create One-Time Invoice" form
			const invoiceSection = page.locator('text=Create One-Time Invoice').locator('..');
			await expect(invoiceSection).toBeVisible();

			// Step 4: Select a one-time project plan from the dropdown
			const planSelect = invoiceSection.locator('select[name="planId"]');
			await expect(planSelect).toBeVisible();
			await planSelect.selectOption({ label: testProjectPlan.name });

			// Wait for the plan details to appear
			await expect(page.locator('text=' + testProjectPlan.name)).toBeVisible();

			// Step 5: Enter a valid amount in the input field
			const amountInput = invoiceSection.locator('input[name="amount"]');
			await expect(amountInput).toBeVisible();
			
			// Enter an amount within the plan's price range
			const testAmount = '1200.00';
			await amountInput.fill(testAmount);

			// Verify client-side validation passes
			const submitButton = invoiceSection.locator('button[type="submit"]');
			await expect(submitButton).toBeEnabled();

			// Verify no validation errors are shown
			await expect(page.locator('.text-red-600')).not.toBeVisible();

			// Step 6: Submit the form
			await submitButton.click();

			// Step 7: Assert that a success message is displayed
			await expect(page.locator('.bg-green-50')).toBeVisible();
			await expect(page.locator('text=Invoice')).toBeVisible();
			await expect(page.locator('text=created and sent successfully')).toBeVisible();

			// Step 8: Assert that the newly created invoice appears in the "Invoice History" list
			const invoiceHistorySection = page.locator('text=One-Time Invoice History').locator('..');
			await expect(invoiceHistorySection).toBeVisible();

			// Check that the invoice appears in the table
			const invoiceTable = invoiceHistorySection.locator('table');
			await expect(invoiceTable).toBeVisible();

			// Verify the invoice details in the table
			const invoiceRow = invoiceTable.locator('tbody tr').first();
			await expect(invoiceRow.locator('td').nth(0)).toContainText(testProjectPlan.name);
			await expect(invoiceRow.locator('td').nth(1)).toContainText(testAmount);
			await expect(invoiceRow.locator('td').nth(2)).toContainText('open'); // Initial status
			await expect(invoiceRow.locator('td').nth(3)).toContainText(new Date().toLocaleDateString());
		});

		test('should validate amount within plan price range', async ({ page }) => {
			// Login as admin
			await page.goto('/login');
			await page.fill('input[name="email"]', adminUser.email);
			await page.fill('input[name="password"]', adminUser.password);
			await page.click('button[type="submit"]');
			await page.waitForURL('**/admin**');

			// Navigate to customer detail page
			await page.goto(`/admin/customers/${testUser.id}`);
			await page.waitForLoadState('networkidle');

			const invoiceSection = page.locator('text=Create One-Time Invoice').locator('..');
			
			// Select the project plan
			await invoiceSection.locator('select[name="planId"]').selectOption({ label: testProjectPlan.name });

			const amountInput = invoiceSection.locator('input[name="amount"]');
			const submitButton = invoiceSection.locator('button[type="submit"]');

			// Test amount too low
			await amountInput.fill('100');
			await expect(page.locator('.text-red-600')).toBeVisible();
			await expect(submitButton).toBeDisabled();

			// Test amount too high
			await amountInput.fill('10000');
			await expect(page.locator('.text-red-600')).toBeVisible();
			await expect(submitButton).toBeDisabled();

			// Test valid amount
			await amountInput.fill('1200');
			await expect(page.locator('.text-red-600')).not.toBeVisible();
			await expect(submitButton).toBeEnabled();
		});

		test('should show error for customer without Stripe integration', async ({ page }) => {
			// Create a customer without Stripe customer ID
			const customerWithoutStripe = await apiClient.createUser({
				email: apiClient.generateTestEmail('no-stripe'),
				password: apiClient.generateTestPassword(),
				username: 'Customer Without Stripe',
				verified: true
			});

			try {
				// Login as admin
				await page.goto('/login');
				await page.fill('input[name="email"]', adminUser.email);
				await page.fill('input[name="password"]', adminUser.password);
				await page.click('button[type="submit"]');
				await page.waitForURL('**/admin**');

				// Navigate to customer without Stripe integration
				await page.goto(`/admin/customers/${customerWithoutStripe.id}`);
				await page.waitForLoadState('networkidle');

				// The invoice creation form should not be visible
				await expect(page.locator('text=Create One-Time Invoice')).not.toBeVisible();
			} finally {
				// Cleanup
				if (customerWithoutStripe?.id) {
					await apiClient.cleanupUserData(customerWithoutStripe.id);
				}
			}
		});

		test('should display invoice history correctly', async ({ page }) => {
			// Login as admin
			await page.goto('/login');
			await page.fill('input[name="email"]', adminUser.email);
			await page.fill('input[name="password"]', adminUser.password);
			await page.click('button[type="submit"]');
			await page.waitForURL('**/admin**');

			// Navigate to customer detail page
			await page.goto(`/admin/customers/${testUser.id}`);
			await page.waitForLoadState('networkidle');

			// Check if invoice history section exists
			const historySection = page.locator('text=One-Time Invoice History').locator('..');
			
			if (await historySection.isVisible()) {
				// Verify table structure
				const table = historySection.locator('table');
				await expect(table).toBeVisible();

				// Verify table headers
				await expect(table.locator('th:has-text("Plan")')).toBeVisible();
				await expect(table.locator('th:has-text("Amount")')).toBeVisible();
				await expect(table.locator('th:has-text("Status")')).toBeVisible();
				await expect(table.locator('th:has-text("Date Created")')).toBeVisible();
				await expect(table.locator('th:has-text("Actions")')).toBeVisible();

				// Check if there are any invoice rows
				const invoiceRows = table.locator('tbody tr');
				const rowCount = await invoiceRows.count();

				if (rowCount > 0) {
					// Verify first row has proper structure
					const firstRow = invoiceRows.first();
					await expect(firstRow.locator('td').nth(0)).toBeVisible(); // Plan name
					await expect(firstRow.locator('td').nth(1)).toBeVisible(); // Amount
					await expect(firstRow.locator('td').nth(2)).toBeVisible(); // Status badge
					await expect(firstRow.locator('td').nth(3)).toBeVisible(); // Date
					await expect(firstRow.locator('td').nth(4)).toBeVisible(); // Actions
				}
			}
		});
	});

	test.describe('Invoice Form Validation', () => {
		test.beforeEach(async ({ page }) => {
			// Login as admin before each validation test
			await page.goto('/login');
			await page.fill('input[name="email"]', adminUser.email);
			await page.fill('input[name="password"]', adminUser.password);
			await page.click('button[type="submit"]');
			await page.waitForURL('**/admin**');

			// Navigate to customer detail page
			await page.goto(`/admin/customers/${testUser.id}`);
			await page.waitForLoadState('networkidle');
		});

		test('should require plan selection', async ({ page }) => {
			const invoiceSection = page.locator('text=Create One-Time Invoice').locator('..');
			const submitButton = invoiceSection.locator('button[type="submit"]');

			// Submit button should be disabled when no plan is selected
			await expect(submitButton).toBeDisabled();
		});

		test('should require amount input', async ({ page }) => {
			const invoiceSection = page.locator('text=Create One-Time Invoice').locator('..');
			
			// Select a plan but don't enter amount
			await invoiceSection.locator('select[name="planId"]').selectOption({ label: testProjectPlan.name });
			
			const submitButton = invoiceSection.locator('button[type="submit"]');
			await expect(submitButton).toBeDisabled();
		});

		test('should show plan details when selected', async ({ page }) => {
			const invoiceSection = page.locator('text=Create One-Time Invoice').locator('..');
			
			// Select a plan
			await invoiceSection.locator('select[name="planId"]').selectOption({ label: testProjectPlan.name });
			
			// Plan details should be visible
			await expect(page.locator('text=' + testProjectPlan.name)).toBeVisible();
			if (testProjectPlan.description) {
				await expect(page.locator('text=' + testProjectPlan.description)).toBeVisible();
			}
			
			// Features should be listed if available
			if (testProjectPlan.features && testProjectPlan.features.length > 0) {
				for (const feature of testProjectPlan.features) {
					await expect(page.locator('text=' + feature)).toBeVisible();
				}
			}
		});
	});

	test.describe('Responsive Design', () => {
		test('should work on mobile devices', async ({ page }) => {
			// Set mobile viewport
			await page.setViewportSize({ width: 375, height: 667 });

			// Login as admin
			await page.goto('/login');
			await page.fill('input[name="email"]', adminUser.email);
			await page.fill('input[name="password"]', adminUser.password);
			await page.click('button[type="submit"]');
			await page.waitForURL('**/admin**');

			// Navigate to customer detail page
			await page.goto(`/admin/customers/${testUser.id}`);
			await page.waitForLoadState('networkidle');

			// Invoice creation form should still be usable on mobile
			const invoiceSection = page.locator('text=Create One-Time Invoice').locator('..');
			await expect(invoiceSection).toBeVisible();

			// Form elements should be accessible
			const planSelect = invoiceSection.locator('select[name="planId"]');
			await expect(planSelect).toBeVisible();
			await planSelect.selectOption({ label: testProjectPlan.name });

			const amountInput = invoiceSection.locator('input[name="amount"]');
			await expect(amountInput).toBeVisible();
			await amountInput.fill('1200');

			const submitButton = invoiceSection.locator('button[type="submit"]');
			await expect(submitButton).toBeVisible();
			await expect(submitButton).toBeEnabled();
		});

		test('should display invoice history table responsively', async ({ page }) => {
			// Set tablet viewport
			await page.setViewportSize({ width: 768, height: 1024 });

			// Login and navigate
			await page.goto('/login');
			await page.fill('input[name="email"]', adminUser.email);
			await page.fill('input[name="password"]', adminUser.password);
			await page.click('button[type="submit"]');
			await page.waitForURL('**/admin**');

			await page.goto(`/admin/customers/${testUser.id}`);
			await page.waitForLoadState('networkidle');

			// Check if invoice history is visible and scrollable
			const historySection = page.locator('text=One-Time Invoice History').locator('..');
			
			if (await historySection.isVisible()) {
				const tableContainer = historySection.locator('.overflow-x-auto');
				await expect(tableContainer).toBeVisible();

				const table = tableContainer.locator('table');
				await expect(table).toBeVisible();
			}
		});
	});
}); 