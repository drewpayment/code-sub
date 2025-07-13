import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/content/homepage.js';
import { ServicesPage } from '../pages/content/services-page.js';
import { ContactPage } from '../pages/content/contact-page.js';

test.describe('Content & Navigation Tests', () => {
	
	test.describe('Homepage Tests', () => {
		
		test('should load homepage with all essential elements', async ({ page }) => {
			const homePage = new HomePage(page);
			
			await homePage.navigate();
			await homePage.assertPageLoaded();
			
			// Test hero section
			await homePage.testHeroSection();
			
			// Test navigation
			await homePage.testNavigation();
			
			// Test footer
			await homePage.testFooter();
		});
		
		test('should have functional CTA buttons', async ({ page }) => {
			const homePage = new HomePage(page);
			
			await homePage.navigate();
			await homePage.testCtaButtons();
		});
		
		test('should be responsive on different viewports', async ({ page }) => {
			const homePage = new HomePage(page);
			
			await homePage.navigate();
			await homePage.testResponsiveDesign();
		});
		
		test('should meet basic accessibility standards', async ({ page }) => {
			const homePage = new HomePage(page);
			
			await homePage.navigate();
			await homePage.testAccessibility();
		});
		
		test('should load within performance thresholds', async ({ page }) => {
			const homePage = new HomePage(page);
			
			await homePage.testPerformance();
		});
		
		test('should have meaningful hero content', async ({ page }) => {
			const homePage = new HomePage(page);
			
			await homePage.navigate();
			
			const heroContent = await homePage.getHeroContent();
			expect(heroContent.title).toBeTruthy();
			expect(heroContent.title.length).toBeGreaterThan(10);
			
			// Hero title should contain relevant business terms
			const title = heroContent.title.toLowerCase();
			const hasRelevantContent = /care|service|health|medical|professional/.test(title);
			expect(hasRelevantContent).toBeTruthy();
		});
		
	});
	
	test.describe('Services Page Tests', () => {
		
		test('should load services page with all content', async ({ page }) => {
			const servicesPage = new ServicesPage(page);
			
			await servicesPage.navigate();
			await servicesPage.assertPageLoaded();
			
			// Test service cards
			await servicesPage.testServiceCards();
			
			// Test service content quality
			await servicesPage.testServiceContent();
		});
		
		test('should have functional CTA buttons on services page', async ({ page }) => {
			const servicesPage = new ServicesPage(page);
			
			await servicesPage.navigate();
			await servicesPage.testCtaButtons();
		});
		
		test('should be responsive on services page', async ({ page }) => {
			const servicesPage = new ServicesPage(page);
			
			await servicesPage.navigate();
			await servicesPage.testResponsiveDesign();
		});
		
		test('should have proper navigation on services page', async ({ page }) => {
			const servicesPage = new ServicesPage(page);
			
			await servicesPage.navigate();
			await servicesPage.testNavigation();
		});
		
		test('should meet accessibility standards on services page', async ({ page }) => {
			const servicesPage = new ServicesPage(page);
			
			await servicesPage.navigate();
			await servicesPage.testAccessibility();
		});
		
		test('should display service titles correctly', async ({ page }) => {
			const servicesPage = new ServicesPage(page);
			
			await servicesPage.navigate();
			
			const serviceTitles = await servicesPage.getServiceTitles();
			expect(serviceTitles.length).toBeGreaterThan(0);
			
			// Each service title should be meaningful
			for (const title of serviceTitles) {
				expect(title.length).toBeGreaterThan(5);
				expect(title).not.toMatch(/^(lorem|ipsum|dolor)/i);
			}
		});
		
	});
	
	test.describe('Contact Page Tests', () => {
		
		test('should load contact page with form', async ({ page }) => {
			const contactPage = new ContactPage(page);
			
			await contactPage.navigate();
			await contactPage.assertPageLoaded();
			
			// Test form fields
			await contactPage.testFormFields();
		});
		
		test('should validate form fields correctly', async ({ page }) => {
			const contactPage = new ContactPage(page);
			
			await contactPage.navigate();
			
			// Test empty form validation
			await contactPage.testFormValidation();
		});
		
		test('should validate email format', async ({ page }) => {
			const contactPage = new ContactPage(page);
			
			await contactPage.navigate();
			
			// Test invalid email validation
			await contactPage.testInvalidEmailValidation();
		});
		
		test('should handle successful form submission', async ({ page }) => {
			const contactPage = new ContactPage(page);
			
			await contactPage.navigate();
			
			// Test successful submission
			await contactPage.testSuccessfulSubmission();
		});
		
		test('should display contact information', async ({ page }) => {
			const contactPage = new ContactPage(page);
			
			await contactPage.navigate();
			await contactPage.testContactInfo();
		});
		
		test('should be accessible for form interaction', async ({ page }) => {
			const contactPage = new ContactPage(page);
			
			await contactPage.navigate();
			await contactPage.testFormAccessibility();
		});
		
		test('should be responsive on contact page', async ({ page }) => {
			const contactPage = new ContactPage(page);
			
			await contactPage.navigate();
			await contactPage.testResponsiveDesign();
		});
		
		test('should handle plan selection if available', async ({ page }) => {
			const contactPage = new ContactPage(page);
			
			await contactPage.navigate();
			
			const hasPlanSelection = await contactPage.hasPlanSelection();
			
			if (hasPlanSelection) {
				const planOptions = await contactPage.getPlanOptions();
				expect(planOptions.length).toBeGreaterThan(0);
				
				// Test form submission with plan selection
				await contactPage.fillContactForm({
					name: 'Test User',
					email: 'test@example.com',
					message: 'Interested in your services',
					plan: planOptions[0]
				});
				
				await contactPage.submitForm();
			}
		});
		
	});
	
	test.describe('Navigation Flow Tests', () => {
		
		test('should navigate between pages correctly', async ({ page }) => {
			const homePage = new HomePage(page);
			
			// Start at homepage
			await homePage.navigate();
			await homePage.assertPageLoaded();
			
			// Navigate to services via navigation menu
			await homePage.clickNavigationLink('Services');
			
			// Verify we're on services page
			const servicesPage = new ServicesPage(page);
			await servicesPage.assertPageLoaded();
			
			// Navigate to contact via navigation menu
			await page.locator('nav a').filter({ hasText: 'Contact' }).click();
			await page.waitForLoadState('networkidle');
			
			// Verify we're on contact page
			const contactPage = new ContactPage(page);
			await contactPage.assertPageLoaded();
		});
		
		test('should navigate via CTA buttons', async ({ page }) => {
			const homePage = new HomePage(page);
			
			await homePage.navigate();
			
			// Click CTA button to go to contact or pricing
			await homePage.clickCtaButton(0);
			
			// Verify navigation worked
			const currentUrl = page.url();
			expect(currentUrl).toMatch(/(contact|pricing)/);
		});
		
		test('should maintain navigation consistency across pages', async ({ page }) => {
			const pages = ['/', '/services', '/contact', '/pricing'];
			
			for (const pagePath of pages) {
				await page.goto(pagePath);
				await page.waitForLoadState('networkidle');
				
				// Check navigation is present and consistent
				const nav = page.locator('nav');
				await expect(nav).toBeVisible();
				
				const navLinks = nav.locator('a');
				const linkCount = await navLinks.count();
				expect(linkCount).toBeGreaterThan(2);
				
				// Check for common navigation links
				const navText = await nav.textContent();
				expect(navText).toBeTruthy();
				
				const hasCommonLinks = /services|contact|pricing|home/i.test(navText!);
				expect(hasCommonLinks).toBeTruthy();
			}
		});
		
	});
	
	test.describe('Cross-page Content Tests', () => {
		
		test('should have consistent branding across pages', async ({ page }) => {
			const pages = ['/', '/services', '/contact'];
			
			for (const pagePath of pages) {
				await page.goto(pagePath);
				await page.waitForLoadState('networkidle');
				
				// Check for consistent header/logo
				const header = page.locator('header, nav');
				await expect(header).toBeVisible();
				
				// Check for consistent footer
				const footer = page.locator('footer');
				await expect(footer).toBeVisible();
				
				// Check page has proper title structure
				const h1 = page.locator('h1');
				await expect(h1).toBeVisible();
				
				const title = await h1.textContent();
				expect(title).toBeTruthy();
				expect(title!.length).toBeGreaterThan(5);
			}
		});
		
		test('should have proper SEO structure on all pages', async ({ page }) => {
			const pages = ['/', '/services', '/contact'];
			
			for (const pagePath of pages) {
				await page.goto(pagePath);
				await page.waitForLoadState('networkidle');
				
				// Check page title
				const pageTitle = await page.title();
				expect(pageTitle).toBeTruthy();
				expect(pageTitle.length).toBeGreaterThan(10);
				
				// Check meta description
				const metaDescription = page.locator('meta[name="description"]');
				const hasMetaDescription = await metaDescription.count() > 0;
				
				if (hasMetaDescription) {
					const description = await metaDescription.getAttribute('content');
					expect(description).toBeTruthy();
					expect(description!.length).toBeGreaterThan(50);
				}
				
				// Check for proper heading structure
				const h1Count = await page.locator('h1').count();
				expect(h1Count).toBe(1); // Should have exactly one H1
			}
		});
		
	});
	
	test.describe('Performance & Load Tests', () => {
		
		test('should load all main pages within performance thresholds', async ({ page }) => {
			const pages = ['/', '/services', '/contact', '/pricing'];
			
			for (const pagePath of pages) {
				const startTime = Date.now();
				
				await page.goto(pagePath);
				await page.waitForLoadState('networkidle');
				
				const loadTime = Date.now() - startTime;
				
				// Page should load within 5 seconds
				expect(loadTime).toBeLessThan(5000);
				
				// Check that essential elements are present
				const h1 = page.locator('h1');
				await expect(h1).toBeVisible();
				
				const nav = page.locator('nav');
				await expect(nav).toBeVisible();
			}
		});
		
		test('should handle network errors gracefully', async ({ page }) => {
			// Test with slow network
			await page.route('**/*', async route => {
				await new Promise(resolve => setTimeout(resolve, 100));
				await route.continue();
			});
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Page should still load
			const h1 = page.locator('h1');
			await expect(h1).toBeVisible();
		});
		
	});
	
}); 