import { expect, type Page } from '@playwright/test';
import { BasePage } from '../base-page.js';

export class ServicesPage extends BasePage {
	// Selectors
	private readonly pageTitle = 'h1';
	private readonly serviceCards = '[data-testid="service-card"], .service-card, .grid > div';
	private readonly serviceHeadings = 'h2, h3';
	private readonly serviceDescriptions = 'p';
	private readonly ctaButtons = 'a[href*="contact"], .btn';
	private readonly breadcrumbs = '[data-testid="breadcrumbs"], .breadcrumbs, nav[aria-label="breadcrumb"]';

	constructor(page: Page) {
		super(page);
	}

	/**
	 * Navigate to the services page
	 */
	async navigate(): Promise<void> {
		await this.goto('/services');
		await this.waitForPageLoad();
	}

	/**
	 * Assert that the services page is loaded correctly
	 */
	async assertPageLoaded(): Promise<void> {
		await this.assertElementVisible(this.pageTitle);
		
		// Check that page title contains "Services" or similar
		const titleText = await this.page.locator(this.pageTitle).textContent();
		expect(titleText).toBeTruthy();
		expect(titleText!.toLowerCase()).toContain('service');
	}

	/**
	 * Test service cards/sections
	 */
	async testServiceCards(): Promise<void> {
		const serviceCards = this.page.locator(this.serviceCards);
		const cardCount = await serviceCards.count();
		
		// Should have at least one service
		expect(cardCount).toBeGreaterThan(0);
		
		// Test each service card
		for (let i = 0; i < Math.min(cardCount, 5); i++) {
			const card = serviceCards.nth(i);
			await expect(card).toBeVisible();
			
			// Check for service heading
			const heading = card.locator('h2, h3, h4');
			const hasHeading = await heading.count() > 0;
			if (hasHeading) {
				await expect(heading.first()).toBeVisible();
			}
			
			// Check for service description
			const description = card.locator('p');
			const hasDescription = await description.count() > 0;
			if (hasDescription) {
				await expect(description.first()).toBeVisible();
			}
		}
	}

	/**
	 * Test service content quality
	 */
	async testServiceContent(): Promise<void> {
		const serviceHeadings = this.page.locator(this.serviceHeadings);
		const headingCount = await serviceHeadings.count();
		
		if (headingCount > 0) {
			// Check that headings have meaningful content
			for (let i = 0; i < Math.min(headingCount, 3); i++) {
				const heading = serviceHeadings.nth(i);
				const headingText = await heading.textContent();
				expect(headingText).toBeTruthy();
				expect(headingText!.length).toBeGreaterThan(5);
			}
		}
		
		const serviceDescriptions = this.page.locator(this.serviceDescriptions);
		const descriptionCount = await serviceDescriptions.count();
		
		if (descriptionCount > 0) {
			// Check that descriptions have meaningful content
			for (let i = 0; i < Math.min(descriptionCount, 3); i++) {
				const description = serviceDescriptions.nth(i);
				const descriptionText = await description.textContent();
				expect(descriptionText).toBeTruthy();
				expect(descriptionText!.length).toBeGreaterThan(20);
			}
		}
	}

	/**
	 * Test CTA buttons functionality
	 */
	async testCtaButtons(): Promise<void> {
		const ctaButtons = this.page.locator(this.ctaButtons);
		const buttonCount = await ctaButtons.count();
		
		if (buttonCount > 0) {
			// Test first CTA button
			const firstCta = ctaButtons.first();
			await expect(firstCta).toBeVisible();
			
			const href = await firstCta.getAttribute('href');
			if (href) {
				expect(href).toMatch(/\/(contact|pricing)/);
			}
		}
	}

	/**
	 * Test responsive design
	 */
	async testResponsiveDesign(): Promise<void> {
		// Test mobile viewport
		await this.page.setViewportSize({ width: 375, height: 667 });
		await this.page.reload();
		await this.waitForPageLoad();
		
		await this.assertElementVisible(this.pageTitle);
		
		// Check that service cards stack properly on mobile
		const serviceCards = this.page.locator(this.serviceCards);
		const cardCount = await serviceCards.count();
		
		if (cardCount > 0) {
			await expect(serviceCards.first()).toBeVisible();
		}
		
		// Reset to desktop
		await this.page.setViewportSize({ width: 1280, height: 720 });
	}

	/**
	 * Test page navigation and breadcrumbs
	 */
	async testNavigation(): Promise<void> {
		// Check for breadcrumbs if they exist
		const breadcrumbs = this.page.locator(this.breadcrumbs);
		const hasBreadcrumbs = await breadcrumbs.count() > 0;
		
		if (hasBreadcrumbs) {
			await expect(breadcrumbs.first()).toBeVisible();
			
			// Check breadcrumb links
			const breadcrumbLinks = breadcrumbs.locator('a');
			const linkCount = await breadcrumbLinks.count();
			
			for (let i = 0; i < Math.min(linkCount, 2); i++) {
				const link = breadcrumbLinks.nth(i);
				const href = await link.getAttribute('href');
				expect(href).toBeTruthy();
			}
		}
	}

	/**
	 * Get all service titles
	 */
	async getServiceTitles(): Promise<string[]> {
		const serviceHeadings = this.page.locator(this.serviceHeadings);
		const headingCount = await serviceHeadings.count();
		const titles: string[] = [];
		
		for (let i = 0; i < headingCount; i++) {
			const heading = serviceHeadings.nth(i);
			const title = await heading.textContent();
			if (title) {
				titles.push(title.trim());
			}
		}
		
		return titles;
	}

	/**
	 * Click on a specific service by title
	 */
	async clickService(serviceTitle: string): Promise<void> {
		const serviceHeading = this.page.locator(this.serviceHeadings).filter({ hasText: serviceTitle });
		
		if (await serviceHeading.count() > 0) {
			await serviceHeading.first().click();
			await this.waitForPageLoad();
		} else {
			throw new Error(`Service with title "${serviceTitle}" not found`);
		}
	}

	/**
	 * Test accessibility features
	 */
	async testAccessibility(): Promise<void> {
		// Check for main heading
		await this.assertElementVisible('h1');
		
		// Check that service cards have proper heading structure
		const serviceHeadings = this.page.locator('h2, h3, h4');
		const headingCount = await serviceHeadings.count();
		expect(headingCount).toBeGreaterThan(0);
		
		// Check for proper link text (no "click here" or "read more" without context)
		const links = this.page.locator('a');
		const linkCount = await links.count();
		
		for (let i = 0; i < Math.min(linkCount, 5); i++) {
			const link = links.nth(i);
			const linkText = await link.textContent();
			if (linkText) {
				// Avoid generic link text
				expect(linkText.toLowerCase()).not.toBe('click here');
				expect(linkText.toLowerCase()).not.toBe('read more');
			}
		}
	}
} 