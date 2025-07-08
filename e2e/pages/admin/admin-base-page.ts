import { expect, type Page } from '@playwright/test';
import { BasePage } from '../base-page.js';

export abstract class AdminBasePage extends BasePage {
	// Common admin selectors
	protected readonly adminSidebar = '.fixed.inset-y-0.left-0';
	protected readonly adminLogo = 'h1:has-text("Code-Sub Admin")';
	protected readonly mainContent = '.pl-64 main';
	protected readonly topBar = 'header.bg-white.shadow-sm';
	protected readonly pageTitle = 'h1.text-2xl.font-semibold';
	protected readonly backToSiteLink = 'a:has-text("Back to site")';
	protected readonly logoutButton = 'button[title="Logout"]';
	protected readonly userInfo = '.absolute.bottom-0 .flex.items-center.space-x-3';

	// Navigation links
	protected readonly dashboardLink = 'a[href="/admin"]:has-text("Dashboard")';
	protected readonly customersLink = 'a[href="/admin/customers"]:has-text("Customers")';
	protected readonly subscriptionsLink = 'a[href="/admin/subscriptions"]:has-text("Subscriptions")';
	protected readonly plansLink = 'a[href="/admin/plans"]:has-text("Plans")';

	constructor(page: Page) {
		super(page);
	}

	/**
	 * Assert that the admin layout is loaded
	 */
	async assertAdminLayoutLoaded(): Promise<void> {
		await this.assertElementVisible(this.adminSidebar);
		await this.assertElementVisible(this.adminLogo);
		await this.assertElementVisible(this.mainContent);
		await this.assertElementVisible(this.topBar);
	}

	/**
	 * Assert that user is authenticated as admin
	 */
	async assertAdminAuthenticated(): Promise<void> {
		await this.assertAdminLayoutLoaded();
		await this.assertElementVisible(this.userInfo);
	}

	/**
	 * Navigate to admin dashboard
	 */
	async navigateToDashboard(): Promise<void> {
		await this.clickElement(this.dashboardLink);
		await this.waitForUrl('admin');
	}

	/**
	 * Navigate to customers page
	 */
	async navigateToCustomers(): Promise<void> {
		await this.clickElement(this.customersLink);
		await this.waitForUrl('admin/customers');
	}

	/**
	 * Navigate to subscriptions page
	 */
	async navigateToSubscriptions(): Promise<void> {
		await this.clickElement(this.subscriptionsLink);
		await this.waitForUrl('admin/subscriptions');
	}

	/**
	 * Navigate to plans page
	 */
	async navigateToPlans(): Promise<void> {
		await this.clickElement(this.plansLink);
		await this.waitForUrl('admin/plans');
	}

	/**
	 * Navigate back to main site
	 */
	async navigateBackToSite(): Promise<void> {
		await this.clickElement(this.backToSiteLink);
		await this.waitForUrl('/');
	}

	/**
	 * Logout from admin panel
	 */
	async logout(): Promise<void> {
		await this.clickElement(this.logoutButton);
		await this.waitForUrl('login');
	}

	/**
	 * Get current page title
	 */
	async getCurrentPageTitle(): Promise<string> {
		return await this.getElementText(this.pageTitle);
	}

	/**
	 * Assert current page title
	 */
	async assertPageTitle(expectedTitle: string): Promise<void> {
		await this.assertElementContainsText(this.pageTitle, expectedTitle);
	}

	/**
	 * Check if navigation item is active
	 */
	async isNavigationItemActive(item: 'dashboard' | 'customers' | 'subscriptions' | 'plans'): Promise<boolean> {
		const linkMap = {
			dashboard: this.dashboardLink,
			customers: this.customersLink,
			subscriptions: this.subscriptionsLink,
			plans: this.plansLink
		};

		const link = this.page.locator(linkMap[item]);
		const className = await link.getAttribute('class');
		return className?.includes('bg-blue-100 text-blue-700') || false;
	}

	/**
	 * Assert that specific navigation item is active
	 */
	async assertNavigationItemActive(item: 'dashboard' | 'customers' | 'subscriptions' | 'plans'): Promise<void> {
		const isActive = await this.isNavigationItemActive(item);
		expect(isActive).toBeTruthy();
	}

	/**
	 * Get user info from the sidebar
	 */
	async getUserInfo(): Promise<{ name: string; role: string }> {
		const userInfoElement = this.page.locator(this.userInfo);
		const name = await userInfoElement.locator('p.text-sm.font-medium').textContent() || '';
		const role = await userInfoElement.locator('p.text-xs.text-gray-500').textContent() || '';
		
		return { name, role };
	}

	/**
	 * Assert user role is admin
	 */
	async assertUserIsAdmin(): Promise<void> {
		const userInfo = await this.getUserInfo();
		expect(userInfo.role.toLowerCase()).toContain('admin');
	}

	/**
	 * Test admin navigation flow
	 */
	async testAdminNavigation(): Promise<void> {
		// Test navigation to each section
		await this.navigateToCustomers();
		await this.assertNavigationItemActive('customers');
		await this.assertPageTitle('Customer Management');

		await this.navigateToSubscriptions();
		await this.assertNavigationItemActive('subscriptions');
		await this.assertPageTitle('Subscription Management');

		await this.navigateToPlans();
		await this.assertNavigationItemActive('plans');
		await this.assertPageTitle('Plan Management');

		await this.navigateToDashboard();
		await this.assertNavigationItemActive('dashboard');
		await this.assertPageTitle('Dashboard');
	}

	/**
	 * Assert that all navigation links are visible
	 */
	async assertNavigationLinksVisible(): Promise<void> {
		await this.assertElementVisible(this.dashboardLink);
		await this.assertElementVisible(this.customersLink);
		await this.assertElementVisible(this.subscriptionsLink);
		await this.assertElementVisible(this.plansLink);
	}

	/**
	 * Check if user has access to admin panel (not redirected to login)
	 */
	async assertHasAdminAccess(): Promise<void> {
		const currentUrl = this.getCurrentUrl();
		expect(currentUrl).not.toContain('/login');
		await this.assertAdminLayoutLoaded();
	}
} 