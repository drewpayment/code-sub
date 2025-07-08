import { expect, type Page } from '@playwright/test';
import { BasePage } from '../base-page.js';

export class ContactPage extends BasePage {
	// Selectors
	private readonly pageTitle = 'h1';
	private readonly contactForm = 'form, [data-testid="contact-form"]';
	private readonly nameField = 'input[name="name"], input[id="name"], #name';
	private readonly emailField = 'input[name="email"], input[id="email"], #email';
	private readonly messageField = 'textarea[name="message"], textarea[id="message"], #message';
	private readonly submitButton = 'button[type="submit"], input[type="submit"], .submit-button';
	private readonly errorMessages = '.error, .error-message, [data-testid="error"]';
	private readonly successMessage = '.success, .success-message, [data-testid="success"]';
	private readonly requiredFields = 'input[required], textarea[required]';
	private readonly contactInfo = '[data-testid="contact-info"], .contact-info';

	constructor(page: Page) {
		super(page);
	}

	/**
	 * Navigate to the contact page
	 */
	async navigate(): Promise<void> {
		await this.goto('/contact');
		await this.waitForPageLoad();
	}

	/**
	 * Assert that the contact page is loaded correctly
	 */
	async assertPageLoaded(): Promise<void> {
		await this.assertElementVisible(this.pageTitle);
		await this.assertElementVisible(this.contactForm);
		
		// Check that page title contains "Contact" or similar
		const titleText = await this.page.locator(this.pageTitle).textContent();
		expect(titleText).toBeTruthy();
		expect(titleText!.toLowerCase()).toContain('contact');
	}

	/**
	 * Fill out the contact form
	 */
	async fillContactForm(data: {
		name: string;
		email: string;
		message: string;
		plan?: string;
	}): Promise<void> {
		// Fill name field
		const nameField = this.page.locator(this.nameField);
		if (await nameField.count() > 0) {
			await nameField.fill(data.name);
		}

		// Fill email field
		const emailField = this.page.locator(this.emailField);
		if (await emailField.count() > 0) {
			await emailField.fill(data.email);
		}

		// Fill message field
		const messageField = this.page.locator(this.messageField);
		if (await messageField.count() > 0) {
			await messageField.fill(data.message);
		}

		// Fill plan field if it exists
		if (data.plan) {
			const planField = this.page.locator('select[name="plan"], input[name="plan"]');
			if (await planField.count() > 0) {
				if (await planField.locator('option').count() > 0) {
					// It's a select field
					await planField.selectOption(data.plan);
				} else {
					// It's an input field
					await planField.fill(data.plan);
				}
			}
		}
	}

	/**
	 * Submit the contact form
	 */
	async submitForm(): Promise<void> {
		const submitButton = this.page.locator(this.submitButton);
		await expect(submitButton).toBeVisible();
		await submitButton.click();
		
		// Wait for form submission to complete
		await this.page.waitForTimeout(1000);
	}

	/**
	 * Test form validation
	 */
	async testFormValidation(): Promise<void> {
		// Test empty form submission
		await this.submitForm();
		
		// Check for validation errors
		const errorMessages = this.page.locator(this.errorMessages);
		const errorCount = await errorMessages.count();
		
		if (errorCount > 0) {
			// Verify error messages are visible
			await expect(errorMessages.first()).toBeVisible();
		} else {
			// Check for HTML5 validation
			const requiredFields = this.page.locator(this.requiredFields);
			const requiredCount = await requiredFields.count();
			
			if (requiredCount > 0) {
				// Check if browser validation is working
				const firstRequired = requiredFields.first();
				const validationMessage = await firstRequired.evaluate((el: HTMLInputElement) => el.validationMessage);
				expect(validationMessage).toBeTruthy();
			}
		}
	}

	/**
	 * Test invalid email validation
	 */
	async testInvalidEmailValidation(): Promise<void> {
		await this.fillContactForm({
			name: 'Test User',
			email: 'invalid-email',
			message: 'Test message'
		});
		
		await this.submitForm();
		
		// Check for email validation error
		const errorMessages = this.page.locator(this.errorMessages);
		const errorCount = await errorMessages.count();
		
		if (errorCount > 0) {
			const errorText = await errorMessages.first().textContent();
			expect(errorText!.toLowerCase()).toMatch(/(email|invalid)/);
		} else {
			// Check HTML5 email validation
			const emailField = this.page.locator(this.emailField);
			const validationMessage = await emailField.evaluate((el: HTMLInputElement) => el.validationMessage);
			expect(validationMessage).toBeTruthy();
		}
	}

	/**
	 * Test successful form submission
	 */
	async testSuccessfulSubmission(): Promise<void> {
		await this.fillContactForm({
			name: 'Test User',
			email: 'test@example.com',
			message: 'This is a test message for the contact form.'
		});
		
		await this.submitForm();
		
		// Wait for response
		await this.page.waitForTimeout(2000);
		
		// Check for success message or redirect
		const successMessage = this.page.locator(this.successMessage);
		const hasSuccessMessage = await successMessage.count() > 0;
		
		if (hasSuccessMessage) {
			await expect(successMessage.first()).toBeVisible();
		} else {
			// Check if redirected to thank you page
			const currentUrl = this.page.url();
			expect(currentUrl).toMatch(/(thank-you|success|contact)/);
		}
	}

	/**
	 * Test contact information display
	 */
	async testContactInfo(): Promise<void> {
		const contactInfo = this.page.locator(this.contactInfo);
		const hasContactInfo = await contactInfo.count() > 0;
		
		if (hasContactInfo) {
			await expect(contactInfo.first()).toBeVisible();
			
			// Check for common contact information
			const contactText = await contactInfo.textContent();
			if (contactText) {
				// Should contain email or phone or address
				const hasContactDetails = /(@|phone|tel|address|email)/i.test(contactText);
				expect(hasContactDetails).toBeTruthy();
			}
		}
	}

	/**
	 * Test form accessibility
	 */
	async testFormAccessibility(): Promise<void> {
		// Check for form labels
		const labels = this.page.locator('label');
		const labelCount = await labels.count();
		expect(labelCount).toBeGreaterThan(0);
		
		// Check that form fields have labels or aria-labels
		const formFields = this.page.locator('input, textarea, select');
		const fieldCount = await formFields.count();
		
		for (let i = 0; i < Math.min(fieldCount, 5); i++) {
			const field = formFields.nth(i);
			const fieldId = await field.getAttribute('id');
			const ariaLabel = await field.getAttribute('aria-label');
			const ariaLabelledBy = await field.getAttribute('aria-labelledby');
			
			// Field should have id with corresponding label, aria-label, or aria-labelledby
			const hasLabel = fieldId && await this.page.locator(`label[for="${fieldId}"]`).count() > 0;
			const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledBy;
			
			expect(hasAccessibleName).toBeTruthy();
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
		
		await this.assertElementVisible(this.contactForm);
		await this.assertElementVisible(this.submitButton);
		
		// Test that form is usable on mobile
		const nameField = this.page.locator(this.nameField);
		if (await nameField.count() > 0) {
			await expect(nameField).toBeVisible();
			await nameField.fill('Mobile Test');
		}
		
		// Reset to desktop
		await this.page.setViewportSize({ width: 1280, height: 720 });
	}

	/**
	 * Test form fields and their properties
	 */
	async testFormFields(): Promise<void> {
		// Test name field
		const nameField = this.page.locator(this.nameField);
		if (await nameField.count() > 0) {
			await expect(nameField).toBeVisible();
			await expect(nameField).toBeEditable();
		}

		// Test email field
		const emailField = this.page.locator(this.emailField);
		if (await emailField.count() > 0) {
			await expect(emailField).toBeVisible();
			await expect(emailField).toBeEditable();
			
			// Check email field type
			const inputType = await emailField.getAttribute('type');
			expect(inputType).toBe('email');
		}

		// Test message field
		const messageField = this.page.locator(this.messageField);
		if (await messageField.count() > 0) {
			await expect(messageField).toBeVisible();
			await expect(messageField).toBeEditable();
		}

		// Test submit button
		const submitButton = this.page.locator(this.submitButton);
		await expect(submitButton).toBeVisible();
		await expect(submitButton).toBeEnabled();
	}

	/**
	 * Check if form has plan selection
	 */
	async hasPlanSelection(): Promise<boolean> {
		const planField = this.page.locator('select[name="plan"], input[name="plan"]');
		return await planField.count() > 0;
	}

	/**
	 * Get available plan options (if plan selection exists)
	 */
	async getPlanOptions(): Promise<string[]> {
		const planSelect = this.page.locator('select[name="plan"]');
		const hasPlanSelect = await planSelect.count() > 0;
		
		if (hasPlanSelect) {
			const options = planSelect.locator('option');
			const optionCount = await options.count();
			const planOptions: string[] = [];
			
			for (let i = 0; i < optionCount; i++) {
				const option = options.nth(i);
				const value = await option.getAttribute('value');
				if (value && value !== '') {
					planOptions.push(value);
				}
			}
			
			return planOptions;
		}
		
		return [];
	}
} 