import { expect, type Page } from '@playwright/test';
import { BasePage } from './base-page.js';
import type { RegistrationData } from '../types/test-types.js';

export class RegistrationPage extends BasePage {
	// Selectors
	private readonly emailInput = 'input[name="email"], input[type="email"]';
	private readonly passwordInput = 'input[name="password"], input[type="password"]:not([name="confirmPassword"])';
	private readonly confirmPasswordInput = 'input[name="confirmPassword"], input[name="passwordConfirm"]';
	private readonly registerButton = 'button[type="submit"], button:has-text("Register"), button:has-text("Sign up")';
	private readonly loginLink = 'a:has-text("Login"), a:has-text("Sign in"), a[href*="login"]';
	private readonly privacyPolicyLink = 'a[href*="privacy"], a:has-text("Privacy Policy")';
	private readonly termsLink = 'a[href*="terms"], a:has-text("Terms")';
	private readonly errorMessage = '[data-testid="error-message"], .error-message, .alert-error, .text-red-500';
	private readonly successMessage = '[data-testid="success-message"], .success-message, .alert-success, .text-green-500';
	private readonly fieldError = '.field-error, .invalid-feedback, .error';

	constructor(page: Page) {
		super(page);
	}

	/**
	 * Navigate to the registration page
	 */
	async navigate(): Promise<void> {
		await this.goto('/register');
		await this.waitForPageLoad();
	}

	/**
	 * Fill in the email field
	 */
	async fillEmail(email: string): Promise<void> {
		await this.fillField(this.emailInput, email);
	}

	/**
	 * Fill in the password field
	 */
	async fillPassword(password: string): Promise<void> {
		await this.fillField(this.passwordInput, password);
	}

	/**
	 * Fill in the confirm password field
	 */
	async fillConfirmPassword(confirmPassword: string): Promise<void> {
		await this.fillField(this.confirmPasswordInput, confirmPassword);
	}

	/**
	 * Click the register button
	 */
	async clickRegister(): Promise<void> {
		await this.clickElement(this.registerButton);
	}

	/**
	 * Perform a complete registration flow
	 */
	async register(registrationData: RegistrationData): Promise<void> {
		await this.fillEmail(registrationData.email);
		await this.fillPassword(registrationData.password);
		await this.fillConfirmPassword(registrationData.confirmPassword);
		await this.clickRegister();
		await this.waitForFormSubmission();
	}

	/**
	 * Perform registration and expect success
	 */
	async registerSuccessfully(registrationData: RegistrationData): Promise<void> {
		await this.register(registrationData);
		
		// Wait for redirect to login page or success message
		try {
			await this.page.waitForURL('**/login**', { timeout: 10000 });
		} catch {
			// If no redirect, check for success message
			await this.assertElementVisible(this.successMessage);
		}
	}

	/**
	 * Perform registration and expect failure
	 */
	async registerWithError(registrationData: RegistrationData): Promise<string> {
		await this.register(registrationData);
		
		// Wait for error message to appear
		await this.waitForElement(this.errorMessage);
		return await this.getElementText(this.errorMessage);
	}

	/**
	 * Click the login link
	 */
	async clickLogin(): Promise<void> {
		await this.clickElement(this.loginLink);
		await this.waitForUrl('login');
	}

	/**
	 * Click the privacy policy link
	 */
	async clickPrivacyPolicy(): Promise<void> {
		await this.clickElement(this.privacyPolicyLink);
		
		// Check if it opens in new tab or same tab
		const pages = this.page.context().pages();
		if (pages.length > 1) {
			// New tab opened
			const newPage = pages[pages.length - 1];
			await newPage.waitForLoadState();
			await expect(newPage).toHaveURL(/.*privacy.*/);
		} else {
			// Same tab
			await this.waitForUrl('privacy');
		}
	}

	/**
	 * Check if we're on the registration page
	 */
	async isOnRegistrationPage(): Promise<boolean> {
		try {
			await expect(this.page).toHaveURL(/.*\/register.*/);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Assert that registration form is visible
	 */
	async assertRegistrationFormVisible(): Promise<void> {
		await this.assertElementVisible(this.emailInput);
		await this.assertElementVisible(this.passwordInput);
		await this.assertElementVisible(this.confirmPasswordInput);
		await this.assertElementVisible(this.registerButton);
	}

	/**
	 * Assert that privacy policy link is visible
	 */
	async assertPrivacyPolicyLinkVisible(): Promise<void> {
		await this.assertElementVisible(this.privacyPolicyLink);
	}

	/**
	 * Assert that an error message is displayed
	 */
	async assertErrorMessage(expectedMessage?: string): Promise<void> {
		await this.assertElementVisible(this.errorMessage);
		
		if (expectedMessage) {
			await this.assertElementContainsText(this.errorMessage, expectedMessage);
		}
	}

	/**
	 * Assert field-specific validation errors
	 */
	async assertFieldError(fieldName: string, expectedMessage?: string): Promise<void> {
		const fieldErrorSelector = `${this.fieldError}[data-field="${fieldName}"], ${this.fieldError}:near(input[name="${fieldName}"])`;
		await this.assertElementVisible(fieldErrorSelector);
		
		if (expectedMessage) {
			await this.assertElementContainsText(fieldErrorSelector, expectedMessage);
		}
	}

	/**
	 * Get the current error message text
	 */
	async getErrorMessageText(): Promise<string | null> {
		if (await this.isElementVisible(this.errorMessage)) {
			return await this.getElementText(this.errorMessage);
		}
		return null;
	}

	/**
	 * Get the current values in the form fields
	 */
	async getFormValues(): Promise<{ email: string; password: string; confirmPassword: string }> {
		const email = await this.page.locator(this.emailInput).inputValue();
		const password = await this.page.locator(this.passwordInput).inputValue();
		const confirmPassword = await this.page.locator(this.confirmPasswordInput).inputValue();
		
		return { email, password, confirmPassword };
	}

	/**
	 * Clear all form fields
	 */
	async clearForm(): Promise<void> {
		await this.page.locator(this.emailInput).clear();
		await this.page.locator(this.passwordInput).clear();
		await this.page.locator(this.confirmPasswordInput).clear();
	}

	/**
	 * Test email validation with invalid emails
	 */
	async testEmailValidation(invalidEmails: string[]): Promise<string[]> {
		const errorMessages: string[] = [];

		for (const email of invalidEmails) {
			await this.clearForm();
			await this.fillEmail(email);
			await this.fillPassword('ValidPassword123!');
			await this.fillConfirmPassword('ValidPassword123!');
			await this.clickRegister();
			
			// Wait for validation error
			await this.page.waitForTimeout(1000);
			
			const errorMessage = await this.getErrorMessageText();
			if (errorMessage) {
				errorMessages.push(`${email}: ${errorMessage}`);
			}
		}

		return errorMessages;
	}

	/**
	 * Test password validation with weak passwords
	 */
	async testPasswordValidation(weakPasswords: string[]): Promise<string[]> {
		const errorMessages: string[] = [];
		const testEmail = 'test@example.com';

		for (const password of weakPasswords) {
			await this.clearForm();
			await this.fillEmail(testEmail);
			await this.fillPassword(password);
			await this.fillConfirmPassword(password);
			await this.clickRegister();
			
			// Wait for validation error
			await this.page.waitForTimeout(1000);
			
			const errorMessage = await this.getErrorMessageText();
			if (errorMessage) {
				errorMessages.push(`${password}: ${errorMessage}`);
			}
		}

		return errorMessages;
	}

	/**
	 * Test password confirmation mismatch
	 */
	async testPasswordMismatch(): Promise<string> {
		await this.clearForm();
		await this.fillEmail('test@example.com');
		await this.fillPassword('Password123!');
		await this.fillConfirmPassword('DifferentPassword123!');
		await this.clickRegister();
		
		await this.waitForElement(this.errorMessage);
		return await this.getElementText(this.errorMessage);
	}

	/**
	 * Test registration with existing email
	 */
	async testExistingEmailRegistration(existingEmail: string): Promise<string> {
		const registrationData: RegistrationData = {
			email: existingEmail,
			password: 'NewPassword123!',
			confirmPassword: 'NewPassword123!'
		};

		return await this.registerWithError(registrationData);
	}

	/**
	 * Assert successful registration message or redirect
	 */
	async assertSuccessfulRegistration(): Promise<void> {
		// Either we get redirected to login page or see a success message
		try {
			await this.page.waitForURL('**/login**', { timeout: 5000 });
		} catch {
			await this.assertElementVisible(this.successMessage);
		}
	}

	/**
	 * Check if register button is disabled
	 */
	async isRegisterButtonDisabled(): Promise<boolean> {
		const button = this.page.locator(this.registerButton);
		return await button.isDisabled();
	}
} 