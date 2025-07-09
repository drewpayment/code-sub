import { test, expect } from '@playwright/test';

test.describe('Simple Subscription Tests', () => {
	
	test('should load pricing page and display plans', async ({ page }) => {
		await page.goto('/pricing');
		
		// Check that the page loads
		await expect(page.locator('h1')).toContainText('Flexible Pricing');
		
		// Check that pricing cards are visible using more specific selectors
		await expect(page.locator('h3').filter({ hasText: 'Essential Care' }).first()).toBeVisible();
		await expect(page.locator('h3').filter({ hasText: 'Professional Care' }).first()).toBeVisible();
		await expect(page.locator('h3').filter({ hasText: 'Premium Care' }).first()).toBeVisible();
		
		// Check that prices are displayed using exact text matches to avoid ambiguity
		await expect(page.getByText('49/mo', { exact: true })).toBeVisible(); // Essential Care price
		await expect(page.getByText('99/mo', { exact: true })).toBeVisible(); // Professional Care price  
		await expect(page.getByText('199/mo', { exact: true })).toBeVisible(); // Premium Care price
	});

	test('should redirect to login when accessing subscription page', async ({ page }) => {
		await page.goto('/account/subscription');
		await page.waitForURL('**/login**');
		expect(page.url()).toContain('/login');
	});

	test('should redirect to login when accessing admin', async ({ page }) => {
		await page.goto('/admin');
		await page.waitForURL('**/login**');
		expect(page.url()).toContain('/login');
	});

	test('should display feature comparison table on pricing page', async ({ page }) => {
		await page.goto('/pricing');
		
		// Check feature comparison table exists
		await expect(page.locator('text=Feature Comparison')).toBeVisible();
		await expect(page.locator('table')).toBeVisible();
		
		// Check that feature rows are present using table cell selectors
		await expect(page.getByRole('cell', { name: 'Hosting & Uptime Monitoring' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Security & Backups' })).toBeVisible();
	});

	test('should display FAQ section on pricing page', async ({ page }) => {
		await page.goto('/pricing');
		
		// Check FAQ section exists
		await expect(page.locator('text=Frequently Asked Questions')).toBeVisible();
		
		// Check that FAQ items are present
		await expect(page.locator('text=What is included in the price?')).toBeVisible();
		await expect(page.locator('text=Can I change my plan later?')).toBeVisible();
	});

	test('should have proper contact links with query parameters', async ({ page }) => {
		await page.goto('/pricing');
		
		// Check that contact links exist with proper parameters
		const contactLinks = page.locator('a[href*="contact"][href*="plan="]');
		await expect(contactLinks.first()).toBeVisible();
		
		// Check that links have source parameter
		const href = await contactLinks.first().getAttribute('href');
		expect(href).toContain('source=pricing');
		expect(href).toContain('plan=');
	});

	test('should handle mobile viewport on pricing page', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/pricing');
		
		// Check that page still loads properly on mobile
		await expect(page.locator('h1')).toContainText('Flexible Pricing');
		await expect(page.locator('h3').filter({ hasText: 'Essential Care' }).first()).toBeVisible();
		
		// Reset viewport
		await page.setViewportSize({ width: 1280, height: 720 });
	});
}); 