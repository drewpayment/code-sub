import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
	
	test.describe('Desktop Screenshots', () => {
		
		test('should match homepage design', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Wait for any animations to complete
			await page.waitForTimeout(1000);
			
			// Take full page screenshot
			await expect(page).toHaveScreenshot('homepage-desktop.png', {
				fullPage: true,
				animations: 'disabled'
			});
		});
		
		test('should match services page design', async ({ page }) => {
			await page.goto('/services');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await expect(page).toHaveScreenshot('services-desktop.png', {
				fullPage: true,
				animations: 'disabled'
			});
		});
		
		test('should match contact page design', async ({ page }) => {
			await page.goto('/contact');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await expect(page).toHaveScreenshot('contact-desktop.png', {
				fullPage: true,
				animations: 'disabled'
			});
		});
		
		test('should match pricing page design', async ({ page }) => {
			await page.goto('/pricing');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await expect(page).toHaveScreenshot('pricing-desktop.png', {
				fullPage: true,
				animations: 'disabled'
			});
		});
		
	});
	
	test.describe('Mobile Screenshots', () => {
		
		test.beforeEach(async ({ page }) => {
			// Set mobile viewport
			await page.setViewportSize({ width: 375, height: 667 });
		});
		
		test('should match homepage mobile design', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await expect(page).toHaveScreenshot('homepage-mobile.png', {
				fullPage: true,
				animations: 'disabled'
			});
		});
		
		test('should match services page mobile design', async ({ page }) => {
			await page.goto('/services');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await expect(page).toHaveScreenshot('services-mobile.png', {
				fullPage: true,
				animations: 'disabled'
			});
		});
		
		test('should match contact page mobile design', async ({ page }) => {
			await page.goto('/contact');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await expect(page).toHaveScreenshot('contact-mobile.png', {
				fullPage: true,
				animations: 'disabled'
			});
		});
		
		test('should match pricing page mobile design', async ({ page }) => {
			await page.goto('/pricing');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await expect(page).toHaveScreenshot('pricing-mobile.png', {
				fullPage: true,
				animations: 'disabled'
			});
		});
		
	});
	
	test.describe('Tablet Screenshots', () => {
		
		test.beforeEach(async ({ page }) => {
			// Set tablet viewport
			await page.setViewportSize({ width: 768, height: 1024 });
		});
		
		test('should match homepage tablet design', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await expect(page).toHaveScreenshot('homepage-tablet.png', {
				fullPage: true,
				animations: 'disabled'
			});
		});
		
		test('should match pricing page tablet design', async ({ page }) => {
			await page.goto('/pricing');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			await expect(page).toHaveScreenshot('pricing-tablet.png', {
				fullPage: true,
				animations: 'disabled'
			});
		});
		
	});
	
	test.describe('Component Screenshots', () => {
		
		test('should match navigation component', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const nav = page.locator('nav');
			await expect(nav).toHaveScreenshot('navigation-component.png', {
				animations: 'disabled'
			});
		});
		
		test('should match footer component', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const footer = page.locator('footer');
			await expect(footer).toHaveScreenshot('footer-component.png', {
				animations: 'disabled'
			});
		});
		
		test('should match pricing cards component', async ({ page }) => {
			await page.goto('/pricing');
			await page.waitForLoadState('networkidle');
			
			// Look for pricing cards container
			const pricingCards = page.locator('.pricing-cards, .tier-container, [data-testid="pricing-cards"]').first();
			const hasPricingCards = await pricingCards.count() > 0;
			
			if (hasPricingCards) {
				await expect(pricingCards).toHaveScreenshot('pricing-cards-component.png', {
					animations: 'disabled'
				});
			} else {
				// Fallback to individual pricing cards
				const cards = page.locator('.tier, .pricing-card').first();
				if (await cards.count() > 0) {
					await expect(cards).toHaveScreenshot('pricing-card-component.png', {
						animations: 'disabled'
					});
				}
			}
		});
		
		test('should match contact form component', async ({ page }) => {
			await page.goto('/contact');
			await page.waitForLoadState('networkidle');
			
			const form = page.locator('form').first();
			await expect(form).toHaveScreenshot('contact-form-component.png', {
				animations: 'disabled'
			});
		});
		
	});
	
	test.describe('Interactive State Screenshots', () => {
		
		test('should match form validation states', async ({ page }) => {
			await page.goto('/contact');
			await page.waitForLoadState('networkidle');
			
			// Submit empty form to trigger validation
			const submitButton = page.locator('button[type="submit"], input[type="submit"]');
			if (await submitButton.count() > 0) {
				await submitButton.click();
				await page.waitForTimeout(500);
				
				// Screenshot form with validation errors
				const form = page.locator('form');
				await expect(form).toHaveScreenshot('contact-form-validation.png', {
					animations: 'disabled'
				});
			}
		});
		
		test('should match hover states on pricing cards', async ({ page }) => {
			await page.goto('/pricing');
			await page.waitForLoadState('networkidle');
			
			const pricingCard = page.locator('.tier, .pricing-card').first();
			if (await pricingCard.count() > 0) {
				// Hover over the card
				await pricingCard.hover();
				await page.waitForTimeout(300);
				
				await expect(pricingCard).toHaveScreenshot('pricing-card-hover.png', {
					animations: 'disabled'
				});
			}
		});
		
		test('should match mobile navigation menu', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Look for mobile menu toggle
			const menuToggle = page.locator('[data-testid="menu-toggle"], .menu-toggle, .hamburger, button[aria-label*="menu"]');
			
			if (await menuToggle.count() > 0) {
				await menuToggle.click();
				await page.waitForTimeout(300);
				
				// Screenshot the opened mobile menu
				const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, nav');
				await expect(mobileMenu.first()).toHaveScreenshot('mobile-navigation-open.png', {
					animations: 'disabled'
				});
			}
		});
		
	});
	
	test.describe('Error State Screenshots', () => {
		
		test('should match 404 page design', async ({ page }) => {
			// Navigate to a non-existent page
			await page.goto('/non-existent-page');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			// Check if we have a custom 404 page
			const pageContent = await page.textContent('body');
			const has404Content = /404|not found|page not found/i.test(pageContent || '');
			
			if (has404Content) {
				await expect(page).toHaveScreenshot('404-page.png', {
					fullPage: true,
					animations: 'disabled'
				});
			}
		});
		
	});
	
	test.describe('Cross-browser Visual Tests', () => {
		
		test('should maintain design consistency across browsers', async ({ page, browserName }) => {
			// Skip visual tests in CI for non-Chromium browsers to avoid flakiness
			test.skip(!!process.env.CI && browserName !== 'chromium', 'Visual tests only run on Chromium in CI');
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(1000);
			
			// Take browser-specific screenshot
			await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
				fullPage: true,
				animations: 'disabled',
				threshold: 0.3 // Allow slight differences between browsers
			});
		});
		
	});
	
}); 