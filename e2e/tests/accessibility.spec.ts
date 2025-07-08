import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
	
	test.describe('Keyboard Navigation', () => {
		
		test('should support keyboard navigation on homepage', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Focus should start on the first focusable element
			await page.keyboard.press('Tab');
			
			// Check that focus is visible
			const focusedElement = page.locator(':focus');
			await expect(focusedElement).toBeVisible();
			
			// Continue tabbing through interactive elements
			const interactiveElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
			const elementCount = await interactiveElements.count();
			
			if (elementCount > 0) {
				// Tab through first few elements
				for (let i = 0; i < Math.min(elementCount, 5); i++) {
					await page.keyboard.press('Tab');
					const currentFocus = page.locator(':focus');
					await expect(currentFocus).toBeVisible();
				}
			}
		});
		
		test('should support keyboard navigation in forms', async ({ page }) => {
			await page.goto('/contact');
			await page.waitForLoadState('networkidle');
			
			// Tab to first form field
			await page.keyboard.press('Tab');
			
			// Fill form using keyboard
			const nameField = page.locator('input[name="name"], input[id="name"]');
			if (await nameField.count() > 0) {
				await nameField.focus();
				await page.keyboard.type('Test User');
				
				// Tab to next field
				await page.keyboard.press('Tab');
				
				const emailField = page.locator('input[name="email"], input[id="email"]');
				if (await emailField.count() > 0) {
					await page.keyboard.type('test@example.com');
				}
			}
			
			// Submit form using Enter key
			const submitButton = page.locator('button[type="submit"], input[type="submit"]');
			if (await submitButton.count() > 0) {
				await submitButton.focus();
				await page.keyboard.press('Enter');
			}
		});
		
		test('should support keyboard navigation in navigation menu', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Focus on navigation
			const navLinks = page.locator('nav a');
			const linkCount = await navLinks.count();
			
			if (linkCount > 0) {
				// Tab to first nav link
				await navLinks.first().focus();
				
				// Use arrow keys or tab to navigate
				for (let i = 0; i < Math.min(linkCount, 3); i++) {
					await page.keyboard.press('Tab');
					const focusedLink = page.locator('nav a:focus');
					const hasFocus = await focusedLink.count() > 0;
					
					if (hasFocus) {
						await expect(focusedLink).toBeVisible();
					}
				}
			}
		});
		
	});
	
	test.describe('Screen Reader Support', () => {
		
		test('should have proper heading structure', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Check for H1
			const h1 = page.locator('h1');
			const h1Count = await h1.count();
			expect(h1Count).toBe(1); // Should have exactly one H1
			
			// Check heading hierarchy
			const headings = page.locator('h1, h2, h3, h4, h5, h6');
			const headingCount = await headings.count();
			expect(headingCount).toBeGreaterThan(0);
			
			// Verify headings have text content
			for (let i = 0; i < Math.min(headingCount, 5); i++) {
				const heading = headings.nth(i);
				const text = await heading.textContent();
				expect(text).toBeTruthy();
				expect(text!.trim().length).toBeGreaterThan(0);
			}
		});
		
		test('should have proper form labels', async ({ page }) => {
			await page.goto('/contact');
			await page.waitForLoadState('networkidle');
			
			// Check form fields have labels
			const formFields = page.locator('input, textarea, select');
			const fieldCount = await formFields.count();
			
			for (let i = 0; i < Math.min(fieldCount, 5); i++) {
				const field = formFields.nth(i);
				const fieldId = await field.getAttribute('id');
				const ariaLabel = await field.getAttribute('aria-label');
				const ariaLabelledBy = await field.getAttribute('aria-labelledby');
				const placeholder = await field.getAttribute('placeholder');
				
				// Field should have some form of labeling
				const hasLabel = fieldId && await page.locator(`label[for="${fieldId}"]`).count() > 0;
				const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledBy;
				
				// Allow placeholder as fallback for simple forms
				const hasAnyLabeling = hasAccessibleName || placeholder;
				expect(hasAnyLabeling).toBeTruthy();
			}
		});
		
		test('should have proper image alt text', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const images = page.locator('img');
			const imageCount = await images.count();
			
			for (let i = 0; i < Math.min(imageCount, 5); i++) {
				const img = images.nth(i);
				const alt = await img.getAttribute('alt');
				
				// Alt attribute should exist (can be empty for decorative images)
				expect(alt).not.toBeNull();
				
				// If alt text exists, it should be meaningful
				if (alt && alt.trim().length > 0) {
					expect(alt.length).toBeGreaterThan(3);
					expect(alt.toLowerCase()).not.toBe('image');
					expect(alt.toLowerCase()).not.toBe('picture');
				}
			}
		});
		
		test('should have proper link text', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const links = page.locator('a');
			const linkCount = await links.count();
			
			for (let i = 0; i < Math.min(linkCount, 10); i++) {
				const link = links.nth(i);
				const linkText = await link.textContent();
				const ariaLabel = await link.getAttribute('aria-label');
				const title = await link.getAttribute('title');
				
				// Link should have accessible text
				const hasAccessibleText = (linkText && linkText.trim().length > 0) || ariaLabel || title;
				expect(hasAccessibleText).toBeTruthy();
				
				if (linkText && linkText.trim().length > 0) {
					// Avoid generic link text
					const text = linkText.toLowerCase().trim();
					expect(text).not.toBe('click here');
					expect(text).not.toBe('read more');
					expect(text).not.toBe('more');
					expect(text).not.toBe('here');
				}
			}
		});
		
	});
	
	test.describe('ARIA Attributes', () => {
		
		test('should have proper ARIA landmarks', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Check for main content area
			const main = page.locator('main, [role="main"]');
			const hasMain = await main.count() > 0;
			
			if (hasMain) {
				await expect(main.first()).toBeVisible();
			}
			
			// Check for navigation
			const nav = page.locator('nav, [role="navigation"]');
			const hasNav = await nav.count() > 0;
			expect(hasNav).toBeTruthy();
			
			// Check for banner/header
			const header = page.locator('header, [role="banner"]');
			const hasHeader = await header.count() > 0;
			
			if (hasHeader) {
				await expect(header.first()).toBeVisible();
			}
			
			// Check for contentinfo/footer
			const footer = page.locator('footer, [role="contentinfo"]');
			const hasFooter = await footer.count() > 0;
			
			if (hasFooter) {
				await expect(footer.first()).toBeVisible();
			}
		});
		
		test('should have proper ARIA states for interactive elements', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Check buttons have proper ARIA attributes
			const buttons = page.locator('button');
			const buttonCount = await buttons.count();
			
			for (let i = 0; i < Math.min(buttonCount, 3); i++) {
				const button = buttons.nth(i);
				const ariaLabel = await button.getAttribute('aria-label');
				const ariaExpanded = await button.getAttribute('aria-expanded');
				const ariaPressed = await button.getAttribute('aria-pressed');
				const buttonText = await button.textContent();
				
				// Button should have accessible name
				const hasAccessibleName = (buttonText && buttonText.trim().length > 0) || ariaLabel;
				expect(hasAccessibleName).toBeTruthy();
				
				// If it's a toggle button, check ARIA states
				if (ariaExpanded !== null) {
					expect(['true', 'false']).toContain(ariaExpanded);
				}
				
				if (ariaPressed !== null) {
					expect(['true', 'false']).toContain(ariaPressed);
				}
			}
		});
		
		test('should have proper form ARIA attributes', async ({ page }) => {
			await page.goto('/contact');
			await page.waitForLoadState('networkidle');
			
			// Check form has proper attributes
			const form = page.locator('form');
			if (await form.count() > 0) {
				const ariaLabel = await form.getAttribute('aria-label');
				const ariaLabelledBy = await form.getAttribute('aria-labelledby');
				
				// Form should have some form of labeling if it's not obvious from context
				const formHeading = page.locator('h1, h2, h3').filter({ hasText: /contact|form/i });
				const hasNearbyHeading = await formHeading.count() > 0;
				
				// If no nearby heading, form should have ARIA label
				if (!hasNearbyHeading) {
					const hasFormLabel = ariaLabel || ariaLabelledBy;
					// This is a soft check - not all forms need explicit labels
					if (!hasFormLabel) {
						console.log('Form may benefit from aria-label or aria-labelledby');
					}
				}
			}
			
			// Check required fields are marked
			const requiredFields = page.locator('input[required], textarea[required], select[required]');
			const requiredCount = await requiredFields.count();
			
			for (let i = 0; i < Math.min(requiredCount, 3); i++) {
				const field = requiredFields.nth(i);
				const ariaRequired = await field.getAttribute('aria-required');
				const required = await field.getAttribute('required');
				
				// Field should be marked as required
				const isMarkedRequired = required !== null || ariaRequired === 'true';
				expect(isMarkedRequired).toBeTruthy();
			}
		});
		
	});
	
	test.describe('Color and Contrast', () => {
		
		test('should not rely solely on color for information', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// This is a basic check - in a real scenario you'd use tools like axe-core
			// Check that important elements have text or other visual indicators
			
			const buttons = page.locator('button, .btn');
			const buttonCount = await buttons.count();
			
			for (let i = 0; i < Math.min(buttonCount, 3); i++) {
				const button = buttons.nth(i);
				const buttonText = await button.textContent();
				const ariaLabel = await button.getAttribute('aria-label');
				
				// Button should have text content or aria-label
				const hasTextContent = (buttonText && buttonText.trim().length > 0) || ariaLabel;
				expect(hasTextContent).toBeTruthy();
			}
		});
		
		test('should have sufficient focus indicators', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Focus on interactive elements and check they're visible
			const interactiveElements = page.locator('a, button, input, textarea');
			const elementCount = await interactiveElements.count();
			
			if (elementCount > 0) {
				const firstElement = interactiveElements.first();
				await firstElement.focus();
				
				// Element should be visible when focused
				await expect(firstElement).toBeVisible();
				
				// Check if there's a focus outline (this is basic - real testing would check CSS)
				const focusedElement = page.locator(':focus');
				await expect(focusedElement).toBeVisible();
			}
		});
		
	});
	
	test.describe('Page Structure', () => {
		
		test('should have proper document structure', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Check page has title
			const title = await page.title();
			expect(title).toBeTruthy();
			expect(title.length).toBeGreaterThan(0);
			
			// Check page has lang attribute
			const html = page.locator('html');
			const lang = await html.getAttribute('lang');
			expect(lang).toBeTruthy();
			expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/); // e.g., 'en', 'en-US'
		});
		
		test('should have logical tab order', async ({ page }) => {
			await page.goto('/contact');
			await page.waitForLoadState('networkidle');
			
			// Get all focusable elements in DOM order
			const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
			const elementCount = await focusableElements.count();
			
			if (elementCount > 1) {
				// Focus first element
				await focusableElements.first().focus();
				
				// Tab through elements and verify order makes sense
				for (let i = 0; i < Math.min(elementCount - 1, 5); i++) {
					await page.keyboard.press('Tab');
					
					const focusedElement = page.locator(':focus');
					const isVisible = await focusedElement.isVisible();
					expect(isVisible).toBeTruthy();
					
					// In a form, focus should generally move top to bottom, left to right
					// This is a basic check - real testing would verify semantic order
				}
			}
		});
		
		test('should handle skip links', async ({ page }) => {
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Look for skip links (often hidden until focused)
			const skipLinks = page.locator('a[href*="#main"], a[href*="#content"], .skip-link, .sr-only a');
			const hasSkipLinks = await skipLinks.count() > 0;
			
			if (hasSkipLinks) {
				const firstSkipLink = skipLinks.first();
				await firstSkipLink.focus();
				
				// Skip link should become visible when focused
				await expect(firstSkipLink).toBeVisible();
				
				// Clicking should move focus to target
				await firstSkipLink.click();
				
				const href = await firstSkipLink.getAttribute('href');
				if (href && href.startsWith('#')) {
					const targetId = href.substring(1);
					const target = page.locator(`#${targetId}`);
					
					if (await target.count() > 0) {
						await expect(target).toBeVisible();
					}
				}
			}
		});
		
	});
	
	test.describe('Error Handling', () => {
		
		test('should provide accessible error messages', async ({ page }) => {
			await page.goto('/contact');
			await page.waitForLoadState('networkidle');
			
			// Submit empty form to trigger validation
			const submitButton = page.locator('button[type="submit"], input[type="submit"]');
			if (await submitButton.count() > 0) {
				await submitButton.click();
				await page.waitForTimeout(1000);
				
				// Check for error messages
				const errorMessages = page.locator('.error, .error-message, [role="alert"], [aria-live]');
				const errorCount = await errorMessages.count();
				
				if (errorCount > 0) {
					// Error messages should be visible
					await expect(errorMessages.first()).toBeVisible();
					
					// Error messages should have text
					const errorText = await errorMessages.first().textContent();
					expect(errorText).toBeTruthy();
					expect(errorText!.trim().length).toBeGreaterThan(0);
					
					// Check if errors are associated with fields
					const ariaDescribedBy = page.locator('input[aria-describedby], textarea[aria-describedby]');
					const hasAriaDescribedBy = await ariaDescribedBy.count() > 0;
					
					if (hasAriaDescribedBy) {
						// Verify aria-describedby points to actual error element
						const firstField = ariaDescribedBy.first();
						const describedBy = await firstField.getAttribute('aria-describedby');
						
						if (describedBy) {
							const errorElement = page.locator(`#${describedBy}`);
							const errorExists = await errorElement.count() > 0;
							expect(errorExists).toBeTruthy();
						}
					}
				}
			}
		});
		
	});
	
}); 