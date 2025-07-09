import { expect, type Page } from '@playwright/test';
import { BasePage } from '../base-page.js';

export class HomePage extends BasePage {
	// Selectors
	private readonly heroSection = 'div.relative.overflow-hidden';
	private readonly heroTitle = 'h1';
	private readonly heroSubtitle = 'h1 + p';
	private readonly ctaButtons = 'a[href*="contact"], a[href*="services"]';
	private readonly navigationMenu = 'nav, header nav';
	private readonly navigationLinks = 'nav a, header nav a';
	private readonly footer = 'footer';
	private readonly servicesSection = 'h2:has-text("Flexible Pricing Plans")';
	private readonly processSection = '.bg-blue-600';

	constructor(page: Page) {
		super(page);
	}

	/**
	 * Navigate to the homepage
	 */
	async navigate(): Promise<void> {
		await this.goto('/');
		await this.waitForPageLoad();
	}

	/**
	 * Assert that the homepage is loaded correctly
	 */
	async assertPageLoaded(): Promise<void> {
		await this.assertElementVisible(this.heroTitle);
		await this.assertElementVisible(this.navigationMenu);
	}

	/**
	 * Test hero section content and layout
	 */
	async testHeroSection(): Promise<void> {
		// Check hero section is visible
		await this.assertElementVisible(this.heroSection);
		await this.assertElementVisible(this.heroTitle);
		
		// Verify hero title contains relevant content
		const heroText = await this.page.locator(this.heroTitle).textContent();
		expect(heroText).toBeTruthy();
		expect(heroText!.length).toBeGreaterThan(10);
		
		// Check for CTA buttons
		const ctaButtons = this.page.locator(this.ctaButtons);
		const ctaCount = await ctaButtons.count();
		expect(ctaCount).toBeGreaterThan(0);
	}

	/**
	 * Test navigation functionality
	 */
	async testNavigation(): Promise<void> {
		await this.assertElementVisible(this.navigationMenu);
		
		const navLinks = this.page.locator(this.navigationLinks);
		const linkCount = await navLinks.count();
		expect(linkCount).toBeGreaterThan(3); // Should have multiple nav links
		
		// Test navigation links are clickable and have proper hrefs
		for (let i = 0; i < Math.min(linkCount, 5); i++) {
			const link = navLinks.nth(i);
			const href = await link.getAttribute('href');
			expect(href).toBeTruthy();
			
			// Verify link is visible and clickable
			await expect(link).toBeVisible();
		}
	}

	/**
	 * Test CTA button functionality
	 */
	async testCtaButtons(): Promise<void> {
		const ctaButtons = this.page.locator(this.ctaButtons);
		const buttonCount = await ctaButtons.count();
		
		if (buttonCount > 0) {
			// Test first CTA button
			const firstCta = ctaButtons.first();
			await expect(firstCta).toBeVisible();
			
			const href = await firstCta.getAttribute('href');
			expect(href).toBeTruthy();
			expect(href).toMatch(/\/(contact|pricing)/);
		}
	}

	/**
	 * Test footer content and links
	 */
	async testFooter(): Promise<void> {
		await this.assertElementVisible(this.footer);
		
		// Check for footer links
		const footerLinks = this.page.locator(`${this.footer} a`);
		const linkCount = await footerLinks.count();
		expect(linkCount).toBeGreaterThan(0);
		
		// Verify footer links have proper hrefs
		for (let i = 0; i < Math.min(linkCount, 3); i++) {
			const link = footerLinks.nth(i);
			const href = await link.getAttribute('href');
			expect(href).toBeTruthy();
		}
	}

	/**
	 * Test responsive design on different viewports
	 */
	async testResponsiveDesign(): Promise<void> {
		// Test mobile viewport
		await this.page.setViewportSize({ width: 375, height: 667 });
		await this.page.reload();
		await this.waitForPageLoad();
		
		await this.assertElementVisible(this.heroTitle);
		await this.assertElementVisible(this.navigationMenu);
		
		// Test tablet viewport
		await this.page.setViewportSize({ width: 768, height: 1024 });
		await this.page.reload();
		await this.waitForPageLoad();
		
		await this.assertElementVisible(this.heroTitle);
		await this.assertElementVisible(this.navigationMenu);
		
		// Reset to desktop
		await this.page.setViewportSize({ width: 1280, height: 720 });
	}

	/**
	 * Test page performance metrics
	 */
	async testPerformance(): Promise<void> {
		const startTime = Date.now();
		await this.navigate();
		const loadTime = Date.now() - startTime;
		
		// Page should load within 3 seconds
		expect(loadTime).toBeLessThan(3000);
		
		// Check for essential elements to ensure page is functional
		await this.assertElementVisible(this.heroTitle);
		await this.assertElementVisible(this.navigationMenu);
	}

	/**
	 * Test accessibility features
	 */
	async testAccessibility(): Promise<void> {
		// Check for main heading
		await this.assertElementVisible('h1');
		
		// Check navigation has proper structure
		await this.assertElementVisible('nav');
		
		// Check for skip links or main content area
		const mainContent = this.page.locator('main, [role="main"], #main-content');
		const hasMainContent = await mainContent.count() > 0;
		
		if (hasMainContent) {
			await expect(mainContent.first()).toBeVisible();
		}
		
		// Check images have alt text (if any)
		const images = this.page.locator('img');
		const imageCount = await images.count();
		
		for (let i = 0; i < Math.min(imageCount, 3); i++) {
			const img = images.nth(i);
			const alt = await img.getAttribute('alt');
			// Alt text should exist (can be empty for decorative images)
			expect(alt).not.toBeNull();
		}
	}

	/**
	 * Click on a navigation link by text
	 */
	async clickNavigationLink(linkText: string): Promise<void> {
		const navLink = this.page.locator(`nav a:has-text("${linkText}")`);
		await navLink.click();
		await this.waitForPageLoad();
	}

	/**
	 * Click on a CTA button and verify navigation
	 */
	async clickCtaButton(index: number = 0): Promise<void> {
		const ctaButtons = this.page.locator(this.ctaButtons);
		const button = ctaButtons.nth(index);
		
		await expect(button).toBeVisible();
		await button.click();
		await this.waitForPageLoad();
	}

	/**
	 * Get hero section text content
	 */
	async getHeroContent(): Promise<{ title: string; subtitle: string }> {
		const title = await this.page.locator(this.heroTitle).textContent() || '';
		
		let subtitle = '';
		const subtitleElement = this.page.locator(this.heroSubtitle);
		const hasSubtitle = await subtitleElement.count() > 0;
		if (hasSubtitle) {
			subtitle = await subtitleElement.textContent() || '';
		}
		
		return { title, subtitle };
	}
} 