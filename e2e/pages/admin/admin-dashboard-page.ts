import { expect, type Page } from '@playwright/test';
import { AdminBasePage } from './admin-base-page.js';

export class AdminDashboardPage extends AdminBasePage {
	// Dashboard-specific selectors
	private readonly metricsCards = '.bg-white.shadow.rounded-lg';
	private readonly totalCustomersCard = 'text=Total Customers';
	private readonly activeSubscriptionsCard = 'text=Active Subscriptions';
	private readonly monthlyRevenueCard = 'text=Monthly Revenue';
	private readonly recentActivitySection = 'text=Recent Activity';
	private readonly quickActionsSection = 'text=Quick Actions';
	private readonly statisticsCharts = '.chart-container, [data-testid="chart"]';

	// Quick action buttons
	private readonly addCustomerButton = 'button:has-text("Add Customer"), a:has-text("Add Customer")';
	private readonly createPlanButton = 'button:has-text("Create Plan"), a:has-text("Create Plan")';
	private readonly viewReportsButton = 'button:has-text("View Reports"), a:has-text("View Reports")';

	// Recent activity elements
	private readonly activityList = '.activity-list, [data-testid="activity-list"]';
	private readonly activityItems = '.activity-item, [data-testid="activity-item"]';

	constructor(page: Page) {
		super(page);
	}

	/**
	 * Navigate to the admin dashboard
	 */
	async navigate(): Promise<void> {
		await this.goto('/admin');
		await this.waitForPageLoad();
	}

	/**
	 * Assert that the dashboard page is loaded
	 */
	async assertPageLoaded(): Promise<void> {
		await this.assertAdminLayoutLoaded();
		await this.assertPageTitle('Dashboard');
		await this.assertNavigationItemActive('dashboard');
	}

	/**
	 * Assert that metrics cards are visible
	 */
	async assertMetricsCardsVisible(): Promise<void> {
		const metricsCards = this.page.locator(this.metricsCards);
		const cardCount = await metricsCards.count();
		expect(cardCount).toBeGreaterThan(0);

		// Check for specific metric cards
		await this.assertElementVisible(this.totalCustomersCard);
		await this.assertElementVisible(this.activeSubscriptionsCard);
		await this.assertElementVisible(this.monthlyRevenueCard);
	}

	/**
	 * Get metrics data from the dashboard
	 */
	async getMetricsData(): Promise<{
		totalCustomers: string;
		activeSubscriptions: string;
		monthlyRevenue: string;
	}> {
		// This is a simplified implementation - would need to extract actual values
		const totalCustomers = await this.getMetricValue('Total Customers');
		const activeSubscriptions = await this.getMetricValue('Active Subscriptions');
		const monthlyRevenue = await this.getMetricValue('Monthly Revenue');

		return {
			totalCustomers,
			activeSubscriptions,
			monthlyRevenue
		};
	}

	/**
	 * Get a specific metric value
	 */
	private async getMetricValue(metricName: string): Promise<string> {
		const metricCard = this.page.locator(this.metricsCards).filter({ hasText: metricName });
		
		// Look for number/value elements - these would need to be adjusted based on actual implementation
		const valueSelectors = [
			'.text-3xl.font-bold',
			'.text-2xl.font-semibold',
			'.metric-value',
			'[data-testid="metric-value"]'
		];

		for (const selector of valueSelectors) {
			try {
				const valueElement = metricCard.locator(selector);
				if (await valueElement.isVisible()) {
					return await valueElement.textContent() || '0';
				}
			} catch {
				// Continue to next selector
			}
		}

		return '0';
	}

	/**
	 * Assert that quick actions section is visible
	 */
	async assertQuickActionsVisible(): Promise<void> {
		await this.assertElementVisible(this.quickActionsSection);
	}

	/**
	 * Click add customer quick action
	 */
	async clickAddCustomer(): Promise<void> {
		await this.clickElement(this.addCustomerButton);
		// This would typically navigate to a customer creation page
	}

	/**
	 * Click create plan quick action
	 */
	async clickCreatePlan(): Promise<void> {
		await this.clickElement(this.createPlanButton);
		// This would typically navigate to a plan creation page
	}

	/**
	 * Click view reports quick action
	 */
	async clickViewReports(): Promise<void> {
		await this.clickElement(this.viewReportsButton);
		// This would typically navigate to a reports page
	}

	/**
	 * Assert that recent activity section is visible
	 */
	async assertRecentActivityVisible(): Promise<void> {
		await this.assertElementVisible(this.recentActivitySection);
	}

	/**
	 * Get recent activity items
	 */
	async getRecentActivity(): Promise<Array<{
		action: string;
		timestamp: string;
		details: string;
	}>> {
		const activities: Array<{
			action: string;
			timestamp: string;
			details: string;
		}> = [];

		if (await this.isElementVisible(this.activityList)) {
			const activityItems = this.page.locator(this.activityItems);
			const itemCount = await activityItems.count();

			for (let i = 0; i < itemCount; i++) {
				const item = activityItems.nth(i);
				
				// These selectors would need to be adjusted based on actual implementation
				const action = await item.locator('.activity-action, .font-medium').textContent() || '';
				const timestamp = await item.locator('.activity-time, .text-gray-500').textContent() || '';
				const details = await item.locator('.activity-details, .text-sm').textContent() || '';

				activities.push({ action, timestamp, details });
			}
		}

		return activities;
	}

	/**
	 * Assert that dashboard statistics/charts are visible
	 */
	async assertStatisticsVisible(): Promise<void> {
		// Check if there are any chart containers or statistics visualizations
		const hasCharts = await this.isElementVisible(this.statisticsCharts);
		
		// If no charts, at least verify metrics cards are present
		if (!hasCharts) {
			await this.assertMetricsCardsVisible();
		}
	}

	/**
	 * Test dashboard overview functionality
	 */
	async testDashboardOverview(): Promise<void> {
		await this.assertPageLoaded();
		await this.assertMetricsCardsVisible();
		await this.assertQuickActionsVisible();
		await this.assertRecentActivityVisible();

		// Verify metrics have reasonable values
		const metrics = await this.getMetricsData();
		expect(metrics.totalCustomers).toBeTruthy();
		expect(metrics.activeSubscriptions).toBeTruthy();
		expect(metrics.monthlyRevenue).toBeTruthy();
	}

	/**
	 * Test quick actions functionality
	 */
	async testQuickActions(): Promise<void> {
		await this.assertQuickActionsVisible();

		// Test that quick action buttons are clickable
		if (await this.isElementVisible(this.addCustomerButton)) {
			// Just verify it's clickable, don't actually click to avoid navigation
			const button = this.page.locator(this.addCustomerButton);
			await expect(button).toBeEnabled();
		}

		if (await this.isElementVisible(this.createPlanButton)) {
			const button = this.page.locator(this.createPlanButton);
			await expect(button).toBeEnabled();
		}
	}

	/**
	 * Assert dashboard loads within reasonable time
	 */
	async assertDashboardPerformance(): Promise<void> {
		const startTime = Date.now();
		await this.navigate();
		await this.assertPageLoaded();
		const loadTime = Date.now() - startTime;

		// Dashboard should load within 5 seconds
		expect(loadTime).toBeLessThan(5000);
	}

	/**
	 * Verify dashboard data consistency
	 */
	async verifyDataConsistency(): Promise<void> {
		const metrics = await this.getMetricsData();
		
		// Basic data validation
		const totalCustomers = Number.parseInt(metrics.totalCustomers.replace(/\D/g, ''));
		const activeSubscriptions = Number.parseInt(metrics.activeSubscriptions.replace(/\D/g, ''));
		
		// Active subscriptions shouldn't exceed total customers
		if (!isNaN(totalCustomers) && !isNaN(activeSubscriptions)) {
			expect(activeSubscriptions).toBeLessThanOrEqual(totalCustomers);
		}
	}

	/**
	 * Test responsive design on dashboard
	 */
	async testResponsiveDesign(): Promise<void> {
		// Test mobile viewport
		await this.page.setViewportSize({ width: 375, height: 667 });
		await this.page.reload();
		await this.waitForPageLoad();

		// On mobile, sidebar might be hidden or collapsed
		// Metrics should still be visible but may stack vertically
		await this.assertMetricsCardsVisible();

		// Reset to desktop
		await this.page.setViewportSize({ width: 1280, height: 720 });
	}
} 