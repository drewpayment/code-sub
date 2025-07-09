import { expect, type Page } from '@playwright/test';
import { BasePage } from './base-page.js';

export class SubscriptionPage extends BasePage {
	// Selectors
	private readonly pageTitle = 'h1:has-text("Subscription Management")';
	private readonly backToAccountLink = 'a[href="/account"]';
	private readonly currentSubscriptionSection = 'text=Current Subscription';
	private readonly availablePlansSection = 'text=Available Plans';
	private readonly billingHistorySection = 'text=Billing History';
	
	// Current subscription elements
	private readonly subscriptionStatus = '.inline-flex.items-center.rounded-full';
	private readonly planName = 'h3.text-lg.font-medium';
	private readonly planPrice = '.text-2xl.font-bold';
	private readonly cancelSubscriptionButton = 'button:has-text("Cancel Subscription")';
	private readonly completeSetupButton = 'button:has-text("Complete Setup")';
	private readonly updatePaymentButton = 'button:has-text("Update Payment")';
	
	// Plan selection elements
	private readonly planCards = '.rounded-lg.border.border-gray-200';
	private readonly subscribeButtons = 'button:has-text("Subscribe to This Plan")';
	private readonly switchPlanButtons = 'button:has-text("Switch to This Plan")';
	
	// Billing history elements
	private readonly showBillingHistoryButton = 'button:has-text("Show History")';
	private readonly hideBillingHistoryButton = 'button:has-text("Hide History")';
	private readonly billingHistoryTable = 'table';
	private readonly invoiceLinks = 'a:has-text("View Invoice")';
	
	// Modal elements
	private readonly cancelConfirmModal = '.fixed.inset-0.z-50';
	private readonly keepSubscriptionButton = 'button:has-text("Keep Subscription")';
	private readonly confirmCancelButton = 'button[type="submit"]:has-text("Cancel")';
	
	// Form messages
	private readonly errorMessage = '.text-red-600';
	private readonly successMessage = '.text-green-600';

	constructor(page: Page) {
		super(page);
	}

	/**
	 * Navigate to the subscription management page
	 */
	async navigate(): Promise<void> {
		await this.goto('/account/subscription');
		await this.waitForPageLoad();
	}

	/**
	 * Assert that the subscription page is loaded
	 */
	async assertPageLoaded(): Promise<void> {
		await this.assertElementVisible(this.pageTitle);
		await this.assertElementVisible(this.backToAccountLink);
	}

	/**
	 * Click back to account link
	 */
	async clickBackToAccount(): Promise<void> {
		await this.clickElement(this.backToAccountLink);
		await this.waitForUrl('account');
	}

	/**
	 * Get current subscription status
	 */
	async getCurrentSubscriptionStatus(): Promise<string | null> {
		if (await this.isElementVisible(this.subscriptionStatus)) {
			return await this.getElementText(this.subscriptionStatus);
		}
		return null;
	}

	/**
	 * Get current plan information
	 */
	async getCurrentPlanInfo(): Promise<{ name: string; price: string } | null> {
		if (await this.isElementVisible(this.currentSubscriptionSection)) {
			const name = await this.getElementText(this.planName);
			const price = await this.getElementText(this.planPrice);
			return { name, price };
		}
		return null;
	}

	/**
	 * Assert that user has an active subscription
	 */
	async assertHasActiveSubscription(): Promise<void> {
		await this.assertElementVisible(this.currentSubscriptionSection);
		const status = await this.getCurrentSubscriptionStatus();
		expect(status?.toLowerCase()).toContain('active');
	}

	/**
	 * Assert that user has no subscription
	 */
	async assertHasNoSubscription(): Promise<void> {
		await this.assertElementVisible(this.availablePlansSection);
		const hasCurrentSubscription = await this.isElementVisible(this.currentSubscriptionSection);
		expect(hasCurrentSubscription).toBeFalsy();
	}

	/**
	 * Subscribe to a plan by name
	 */
	async subscribeToPlan(planName: string): Promise<void> {
		const planCard = this.page.locator(this.planCards).filter({ hasText: planName });
		const subscribeButton = planCard.locator(this.subscribeButtons);
		
		await subscribeButton.click();
		await this.waitForFormSubmission();
	}

	/**
	 * Switch to a different plan
	 */
	async switchToPlan(planName: string): Promise<void> {
		const planCard = this.page.locator(this.planCards).filter({ hasText: planName });
		const switchButton = planCard.locator(this.switchPlanButtons);
		
		await switchButton.click();
		await this.waitForFormSubmission();
	}

	/**
	 * Cancel current subscription
	 */
	async cancelSubscription(): Promise<void> {
		await this.clickElement(this.cancelSubscriptionButton);
		await this.assertElementVisible(this.cancelConfirmModal);
		await this.clickElement(this.confirmCancelButton);
		await this.waitForFormSubmission();
	}

	/**
	 * Cancel subscription but keep it (dismiss modal)
	 */
	async dismissCancelSubscription(): Promise<void> {
		await this.clickElement(this.cancelSubscriptionButton);
		await this.assertElementVisible(this.cancelConfirmModal);
		await this.clickElement(this.keepSubscriptionButton);
		await this.waitForElementToBeHidden(this.cancelConfirmModal);
	}

	/**
	 * Complete subscription setup for pending subscriptions
	 */
	async completeSubscriptionSetup(): Promise<void> {
		await this.clickElement(this.completeSetupButton);
		await this.waitForFormSubmission();
	}

	/**
	 * Update payment method for overdue subscriptions
	 */
	async updatePaymentMethod(): Promise<void> {
		await this.clickElement(this.updatePaymentButton);
		await this.waitForFormSubmission();
	}

	/**
	 * Show billing history
	 */
	async showBillingHistory(): Promise<void> {
		if (await this.isElementVisible(this.showBillingHistoryButton)) {
			await this.clickElement(this.showBillingHistoryButton);
			await this.assertElementVisible(this.billingHistoryTable);
		}
	}

	/**
	 * Hide billing history
	 */
	async hideBillingHistory(): Promise<void> {
		if (await this.isElementVisible(this.hideBillingHistoryButton)) {
			await this.clickElement(this.hideBillingHistoryButton);
			await this.waitForElementToBeHidden(this.billingHistoryTable);
		}
	}

	/**
	 * Get billing history data
	 */
	async getBillingHistory(): Promise<Array<{
		date: string;
		description: string;
		amount: string;
		status: string;
	}>> {
		await this.showBillingHistory();
		
		const history: Array<{
			date: string;
			description: string;
			amount: string;
			status: string;
		}> = [];
		
		const rows = this.page.locator(`${this.billingHistoryTable} tbody tr`);
		const rowCount = await rows.count();
		
		for (let i = 0; i < rowCount; i++) {
			const row = rows.nth(i);
			const cells = row.locator('td');
			
			const date = await cells.nth(0).textContent() || '';
			const description = await cells.nth(1).textContent() || '';
			const amount = await cells.nth(2).textContent() || '';
			const status = await cells.nth(3).textContent() || '';
			
			history.push({ date, description, amount, status });
		}
		
		return history;
	}

	/**
	 * Click on an invoice link
	 */
	async clickInvoiceLink(index: number): Promise<void> {
		const invoiceLinks = this.page.locator(this.invoiceLinks);
		await invoiceLinks.nth(index).click();
	}

	/**
	 * Get available plans
	 */
	async getAvailablePlans(): Promise<Array<{
		name: string;
		price: string;
		description: string;
		isCurrent: boolean;
	}>> {
		const plans: Array<{
			name: string;
			price: string;
			description: string;
			isCurrent: boolean;
		}> = [];
		
		const planCards = this.page.locator(this.planCards);
		const cardCount = await planCards.count();
		
		for (let i = 0; i < cardCount; i++) {
			const card = planCards.nth(i);
			
			const name = await card.locator('h3').textContent() || '';
			const price = await card.locator('.text-3xl.font-bold').textContent() || '';
			const description = await card.locator('.text-sm.text-gray-600').first().textContent() || '';
			const isCurrent = await card.locator('text=Current Plan').isVisible();
			
			plans.push({ name, price, description, isCurrent });
		}
		
		return plans;
	}

	/**
	 * Assert subscription status
	 */
	async assertSubscriptionStatus(expectedStatus: 'active' | 'pending' | 'cancelled' | 'overdue'): Promise<void> {
		const status = await this.getCurrentSubscriptionStatus();
		expect(status?.toLowerCase()).toContain(expectedStatus);
	}

	/**
	 * Assert plan features are displayed
	 */
	async assertPlanFeaturesVisible(planName: string): Promise<void> {
		const planCard = this.page.locator(this.planCards).filter({ hasText: planName });
		await expect(planCard.locator('text=Features:')).toBeVisible();
	}

	/**
	 * Assert error message is displayed
	 */
	async assertErrorMessage(expectedMessage?: string): Promise<void> {
		await this.assertElementVisible(this.errorMessage);
		
		if (expectedMessage) {
			await this.assertElementContainsText(this.errorMessage, expectedMessage);
		}
	}

	/**
	 * Assert success message is displayed
	 */
	async assertSuccessMessage(expectedMessage?: string): Promise<void> {
		await this.assertElementVisible(this.successMessage);
		
		if (expectedMessage) {
			await this.assertElementContainsText(this.successMessage, expectedMessage);
		}
	}

	/**
	 * Assert no error or success messages are displayed
	 */
	async assertNoMessages(): Promise<void> {
		const hasError = await this.isElementVisible(this.errorMessage);
		const hasSuccess = await this.isElementVisible(this.successMessage);
		
		expect(hasError).toBeFalsy();
		expect(hasSuccess).toBeFalsy();
	}

	/**
	 * Assert cancel confirmation modal is visible
	 */
	async assertCancelModalVisible(): Promise<void> {
		await this.assertElementVisible(this.cancelConfirmModal);
		await this.assertElementContainsText(this.cancelConfirmModal, 'Cancel Subscription');
	}

	/**
	 * Assert that a specific plan is marked as current
	 */
	async assertPlanIsCurrent(planName: string): Promise<void> {
		const planCard = this.page.locator(this.planCards).filter({ hasText: planName });
		await expect(planCard.locator('text=Current Plan')).toBeVisible();
	}

	/**
	 * Assert that subscription actions are available based on status
	 */
	async assertSubscriptionActionsForStatus(status: 'active' | 'pending' | 'cancelled' | 'overdue'): Promise<void> {
		switch (status) {
			case 'active':
				await this.assertElementVisible(this.cancelSubscriptionButton);
				break;
			case 'pending':
				await this.assertElementVisible(this.completeSetupButton);
				break;
			case 'overdue':
				await this.assertElementVisible(this.updatePaymentButton);
				break;
			case 'cancelled':
				// No specific action buttons for cancelled subscriptions
				break;
		}
	}

	/**
	 * Test the complete subscription flow from selection to activation
	 */
	async testCompleteSubscriptionFlow(planName: string): Promise<void> {
		// Start with no subscription
		await this.assertHasNoSubscription();
		
		// Subscribe to a plan
		await this.subscribeToPlan(planName);
		
		// Handle potential redirect to Stripe or success page
		// This would need to be adapted based on the actual implementation
		await this.page.waitForTimeout(2000);
		
		// Verify subscription was created (might be pending)
		const status = await this.getCurrentSubscriptionStatus();
		expect(status).toBeTruthy();
	}
} 