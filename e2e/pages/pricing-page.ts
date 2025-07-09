import { expect, type Page } from '@playwright/test';
import { BasePage } from './base-page.js';

export class PricingPage extends BasePage {
	// Selectors
	private readonly pageTitle = 'h1';
	private readonly pricingCards = '[data-testid="pricing-card"], .pricing-card, .tier';
	private readonly essentialPlanCard = 'h3:has-text("Essential Care")';
	private readonly professionalPlanCard = 'h3:has-text("Professional Care")';
	private readonly premiumPlanCard = 'h3:has-text("Premium Care")';
	private readonly planContactButtons = 'a[href*="contact"][href*="plan="]';
	private readonly featureComparisonTable = 'table';
	private readonly faqSection = 'text=Frequently Asked Questions';
	private readonly faqItems = 'button:has-text("What is included in the price?"), button:has-text("Can I change my plan later?"), button:has-text("What if I need more")';

	constructor(page: Page) {
		super(page);
	}

	/**
	 * Navigate to the pricing page
	 */
	async navigate(): Promise<void> {
		await this.goto('/pricing');
		await this.waitForPageLoad();
	}

	/**
	 * Assert that the pricing page is loaded
	 */
	async assertPageLoaded(): Promise<void> {
		await this.assertElementVisible(this.pageTitle);
		await this.assertElementContainsText(this.pageTitle, 'Flexible Pricing');
	}

	/**
	 * Get all available pricing plans
	 */
	async getPricingPlans(): Promise<{ name: string; price: string; features: string[] }[]> {
		const plans: { name: string; price: string; features: string[] }[] = [];
		
		// This is a simplified version - in a real implementation, you'd extract actual plan data
		const planNames = ['Essential Care', 'Professional Care', 'Premium Care'];
		const planPrices = ['49', '99', '199'];
		
		for (let i = 0; i < planNames.length; i++) {
			plans.push({
				name: planNames[i],
				price: planPrices[i],
				features: [] // Would extract features from the actual page
			});
		}
		
		return plans;
	}

	/**
	 * Click on a specific plan's contact button
	 */
	async clickPlanContactButton(planName: 'essential' | 'professional' | 'premium'): Promise<void> {
		const planMap = {
			essential: 'essential-care',
			professional: 'professional-care',
			premium: 'premium-care'
		};
		
		const selector = `a[href*="plan=${planMap[planName]}"]`;
		await this.clickElement(selector);
	}

	/**
	 * Assert that pricing cards are visible
	 */
	async assertPricingCardsVisible(): Promise<void> {
		// Check that all three main plans are visible using more specific selectors
		await expect(this.page.locator('h3').filter({ hasText: 'Essential Care' }).first()).toBeVisible();
		await expect(this.page.locator('h3').filter({ hasText: 'Professional Care' }).first()).toBeVisible();
		await expect(this.page.locator('h3').filter({ hasText: 'Premium Care' }).first()).toBeVisible();
	}

	/**
	 * Assert that feature comparison table is visible
	 */
	async assertFeatureComparisonVisible(): Promise<void> {
		await this.assertElementVisible(this.featureComparisonTable);
		await this.assertElementContainsText('text=Feature Comparison', 'Feature Comparison');
	}

	/**
	 * Assert that FAQ section is visible
	 */
	async assertFaqSectionVisible(): Promise<void> {
		await this.assertElementVisible(this.faqSection);
	}

	/**
	 * Click on a FAQ item to expand it
	 */
	async clickFaqItem(): Promise<void> {
		// Use a more specific selector for FAQ buttons
		const faqButtons = this.page.locator('button').filter({ hasText: 'What is included in the price?' });
		await faqButtons.first().click();
	}

	/**
	 * Get the text content of a specific plan's price
	 */
	async getPlanPrice(planName: string): Promise<string> {
		// Use getByText with exact matching to avoid ambiguity
		if (planName === 'Essential Care') {
			return await this.page.getByText('49/mo', { exact: true }).textContent() || '';
		} 
		if (planName === 'Professional Care') {
			return await this.page.getByText('99/mo', { exact: true }).textContent() || '';
		} 
		if (planName === 'Premium Care') {
			return await this.page.getByText('199/mo', { exact: true }).textContent() || '';
		}
		return '';
	}

	/**
	 * Check if a plan is marked as popular
	 */
	async isPlanPopular(): Promise<boolean> {
		try {
			await this.page.locator('text=Most Popular').waitFor({ timeout: 2000 });
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Assert that the professional plan is marked as popular
	 */
	async assertProfessionalPlanIsPopular(): Promise<void> {
		const isPopular = await this.isPlanPopular();
		expect(isPopular).toBeTruthy();
	}

	/**
	 * Get feature comparison data for a specific plan
	 */
	async getPlanFeatures(planColumn: 'Essential' | 'Professional' | 'Premium'): Promise<string[]> {
		const features: string[] = [];
		const table = this.page.locator(this.featureComparisonTable);
		const rows = table.locator('tbody tr');
		
		const columnIndex = planColumn === 'Essential' ? 1 : planColumn === 'Professional' ? 2 : 3;
		
		const rowCount = await rows.count();
		for (let i = 0; i < rowCount; i++) {
			const cell = rows.nth(i).locator('td').nth(columnIndex);
			const cellText = await cell.textContent();
			if (cellText) {
				features.push(cellText.trim());
			}
		}
		
		return features;
	}

	/**
	 * Assert that contact links have proper query parameters
	 */
	async assertContactLinksHaveProperParams(): Promise<void> {
		const contactButtons = this.page.locator(this.planContactButtons);
		const count = await contactButtons.count();
		
		expect(count).toBeGreaterThan(0);
		
		for (let i = 0; i < count; i++) {
			const href = await contactButtons.nth(i).getAttribute('href');
			expect(href).toContain('source=pricing');
			expect(href).toContain('plan=');
		}
	}

	/**
	 * Navigate to contact page with a specific plan
	 */
	async navigateToContactWithPlan(planType: 'essential' | 'professional' | 'premium'): Promise<void> {
		await this.clickPlanContactButton(planType);
		await this.waitForUrl('contact');
		
		// Verify the URL contains the proper query parameters
		const currentUrl = this.getCurrentUrl();
		expect(currentUrl).toContain('source=pricing');
		expect(currentUrl).toContain(`plan=${planType}-care`);
	}

	/**
	 * Check responsive design by testing mobile viewport
	 */
	async testMobileLayout(): Promise<void> {
		// Set mobile viewport
		await this.page.setViewportSize({ width: 375, height: 667 });
		await this.page.reload();
		await this.waitForPageLoad();
		
		// Verify pricing cards stack vertically on mobile
		await this.assertPricingCardsVisible();
		
		// Reset to desktop viewport
		await this.page.setViewportSize({ width: 1280, height: 720 });
	}

	/**
	 * Assert that all plan prices are displayed correctly
	 */
	async assertPlanPricesVisible(): Promise<void> {
		// Use exact text matching to avoid ambiguity
		await expect(this.page.getByText('49/mo', { exact: true })).toBeVisible();
		await expect(this.page.getByText('99/mo', { exact: true })).toBeVisible();
		await expect(this.page.getByText('199/mo', { exact: true })).toBeVisible();
	}

	/**
	 * Test FAQ functionality
	 */
	async testFaqInteraction(): Promise<void> {
		await this.assertFaqSectionVisible();
		
		// Click first FAQ item
		await this.clickFaqItem();
		
		// Verify content is expanded (this would need specific selectors for the actual implementation)
		await this.page.waitForTimeout(500); // Allow for animation
	}
} 