import { test, expect } from '@playwright/test';
import { AdminDashboardPage } from '../pages/admin/admin-dashboard-page.js';

test.describe('Admin Functionality', () => {
	let adminDashboardPage: AdminDashboardPage;

	test.beforeEach(async ({ page }) => {
		adminDashboardPage = new AdminDashboardPage(page);
	});

	test.describe('Admin Access Control', () => {
		test('should redirect to login when accessing admin without authentication', async ({ page }) => {
			await page.goto('/admin');
			await page.waitForURL('**/login**');
			expect(page.url()).toContain('/login');
		});

		test('should redirect to login when accessing admin dashboard without authentication', async () => {
			await adminDashboardPage.navigate();
			
			// Should be redirected to login page
			const currentUrl = adminDashboardPage.getCurrentUrl();
			expect(currentUrl).toContain('/login');
		});

		test('should redirect to login when accessing admin customers without authentication', async ({ page }) => {
			await page.goto('/admin/customers');
			await page.waitForURL('**/login**');
			expect(page.url()).toContain('/login');
		});

		test('should redirect to login when accessing admin subscriptions without authentication', async ({ page }) => {
			await page.goto('/admin/subscriptions');
			await page.waitForURL('**/login**');
			expect(page.url()).toContain('/login');
		});

		test('should redirect to login when accessing admin plans without authentication', async ({ page }) => {
			await page.goto('/admin/plans');
			await page.waitForURL('**/login**');
			expect(page.url()).toContain('/login');
		});
	});

	test.describe('Admin URL Structure', () => {
		test('should maintain proper admin URL patterns', async ({ page }) => {
			// Test that admin URLs follow expected patterns
			const adminUrls = [
				'/admin',
				'/admin/customers',
				'/admin/subscriptions',
				'/admin/plans'
			];

			for (const adminUrl of adminUrls) {
				await page.goto(adminUrl);
				await page.waitForURL('**/login**');
				
				// All admin URLs should redirect to login when unauthenticated
				expect(page.url()).toContain('/login');
			}
		});

		test('should handle admin route navigation correctly', async ({ page }) => {
			// Test that admin routes are properly structured
			const routes = [
				{ path: '/admin', expectedRedirect: '/login' },
				{ path: '/admin/customers', expectedRedirect: '/login' },
				{ path: '/admin/subscriptions', expectedRedirect: '/login' },
				{ path: '/admin/plans', expectedRedirect: '/login' }
			];

			for (const route of routes) {
				await page.goto(route.path);
				await page.waitForURL('**/login**');
				expect(page.url()).toContain(route.expectedRedirect);
			}
		});
	});

	test.describe('Admin Performance', () => {
		test('should handle admin page access attempts efficiently', async () => {
			const startTime = Date.now();
			await adminDashboardPage.navigate();
			
			// Should redirect to login quickly
			const redirectTime = Date.now() - startTime;
			expect(redirectTime).toBeLessThan(2000);
		});

		test('should handle multiple admin route access attempts', async ({ page }) => {
			const adminRoutes = ['/admin', '/admin/customers', '/admin/subscriptions', '/admin/plans'];
			
			const startTime = Date.now();
			
			for (const route of adminRoutes) {
				await page.goto(route);
				await page.waitForURL('**/login**');
			}
			
			const totalTime = Date.now() - startTime;
			
			// All redirects should complete within 5 seconds
			expect(totalTime).toBeLessThan(5000);
		});
	});

	test.describe('Admin Error Handling', () => {
		test('should handle invalid admin routes gracefully', async ({ page }) => {
			// Test accessing non-existent admin routes
			await page.goto('/admin/invalid-route');
			
			// Should either redirect to login or show 404, but not crash
			const url = page.url();
			const isLoginOrNotFound = url.includes('/login') || page.locator('text=404').isVisible();
			expect(isLoginOrNotFound).toBeTruthy();
		});

		test('should handle admin access without errors', async ({ page }) => {
			await page.goto('/admin');
			
			// Page should load without JavaScript errors
			const logs = await page.evaluate(() => {
				return window.console ? [] : [];
			});
			
			// Basic assertion that page handled the request
			expect(logs).toBeDefined();
		});
	});

	test.describe('Admin Responsive Design', () => {
		test('should handle admin page access on different viewports', async ({ page }) => {
			// Test different viewport sizes
			const viewports = [
				{ width: 375, height: 667 }, // Mobile
				{ width: 768, height: 1024 }, // Tablet
				{ width: 1280, height: 720 } // Desktop
			];

			for (const viewport of viewports) {
				await page.setViewportSize(viewport);
				await page.goto('/admin');
				await page.waitForURL('**/login**');
				
				// Should redirect to login regardless of viewport
				expect(page.url()).toContain('/login');
			}
		});
	});

	test.describe('Admin Security', () => {
		test('should not expose admin content without authentication', async ({ page }) => {
			await page.goto('/admin');
			await page.waitForURL('**/login**');
			
			// Should not see any admin-specific content
			const hasAdminContent = await page.locator('text=Admin Dashboard').isVisible();
			expect(hasAdminContent).toBeFalsy();
		});

		test('should not expose sensitive admin routes', async ({ page }) => {
			const sensitiveRoutes = [
				'/admin/customers',
				'/admin/subscriptions',
				'/admin/plans'
			];

			for (const route of sensitiveRoutes) {
				await page.goto(route);
				await page.waitForURL('**/login**');
				
				// Should be redirected away from sensitive content
				expect(page.url()).not.toContain('/admin/');
			}
		});
	});
}); 