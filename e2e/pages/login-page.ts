import { expect, type Page } from '@playwright/test';
import { BasePage } from './base-page.js';
import type { LoginCredentials } from '../types/test-types.js';

export class LoginPage extends BasePage {
	// Selectors
	private readonly emailInput = 'input[name="email"], input[type="email"]';
	private readonly passwordInput = 'input[name="password"], input[type="password"]';
	private readonly loginButton = 'button[type="submit"], button:has-text("Log in"), button:has-text("Login")';
	private readonly forgotPasswordLink = 'a:has-text("Forgot"), a[href*="forgot"]';
	private readonly registerLink = 'a:has-text("Register"), a:has-text("Sign up"), a[href*="register"]';
	private readonly errorMessage = '[data-testid="error-message"], .error-message, .alert-error, .text-red-500';
	private readonly successMessage = '[data-testid="success-message"], .success-message, .alert-success, .text-green-500';

	constructor(page: Page) {
		super(page);
	}

	/**
	 * Navigate to the login page
	 */
	async navigate(): Promise<void> {
		await this.goto('/login');
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
	 * Click the login button
	 */
	async clickLogin(): Promise<void> {
		await this.clickElement(this.loginButton);
	}

	/**
	 * Perform a complete login flow
	 */
	async login(credentials: LoginCredentials): Promise<void> {
		await this.fillEmail(credentials.email);
		await this.fillPassword(credentials.password);
		await this.clickLogin();
		await this.waitForFormSubmission();
	}

	/**
	 * Perform login and expect success (redirect to dashboard/account)
	 */
	async loginSuccessfully(credentials: LoginCredentials): Promise<void> {
		await this.login(credentials);
		
		// Wait for redirect - could be to account, dashboard, or home page
		await this.page.waitForURL('**/account**', { timeout: 10000 });
	}

	/**
	 * Perform login and expect failure
	 */
	async loginWithError(credentials: LoginCredentials): Promise<string> {
		await this.login(credentials);
		
		// Wait for error message to appear
		await this.waitForElement(this.errorMessage);
		return await this.getElementText(this.errorMessage);
	}

	/**
	 * Click the forgot password link
	 */
	async clickForgotPassword(): Promise<void> {
		await this.clickElement(this.forgotPasswordLink);
		await this.waitForUrl('forgot-password');
	}

	/**
	 * Click the register link
	 */
	async clickRegister(): Promise<void> {
		await this.clickElement(this.registerLink);
		await this.waitForUrl('register');
	}

	/**
	 * Check if we're on the login page
	 */
	async isOnLoginPage(): Promise<boolean> {
		try {
			await expect(this.page).toHaveURL(/.*\/login.*/);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Assert that login form is visible
	 */
	async assertLoginFormVisible(): Promise<void> {
		await this.assertElementVisible(this.emailInput);
		await this.assertElementVisible(this.passwordInput);
		await this.assertElementVisible(this.loginButton);
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
	 * Assert that no error message is displayed
	 */
	async assertNoErrorMessage(): Promise<void> {
		const isErrorVisible = await this.isElementVisible(this.errorMessage);
		expect(isErrorVisible).toBeFalsy();
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
	 * Check if the login button is disabled
	 */
	async isLoginButtonDisabled(): Promise<boolean> {
		const button = this.page.locator(this.loginButton);
		return await button.isDisabled();
	}

	/**
	 * Get the current values in the form fields
	 */
	async getFormValues(): Promise<{ email: string; password: string }> {
		const email = await this.page.locator(this.emailInput).inputValue();
		const password = await this.page.locator(this.passwordInput).inputValue();
		
		return { email, password };
	}

	/**
	 * Clear all form fields
	 */
	async clearForm(): Promise<void> {
		await this.page.locator(this.emailInput).clear();
		await this.page.locator(this.passwordInput).clear();
	}

	/**
	 * Check if form fields are preserved after failed login
	 */
	async assertFormFieldsPreserved(originalEmail: string): Promise<void> {
		const currentValues = await this.getFormValues();
		expect(currentValues.email).toBe(originalEmail);
		// Password should be cleared for security
		expect(currentValues.password).toBe('');
	}

	/**
	 * Perform multiple rapid login attempts (for rate limiting tests)
	 */
	async performRapidLoginAttempts(credentials: LoginCredentials, attempts: number): Promise<string[]> {
		const errorMessages: string[] = [];

		for (let i = 0; i < attempts; i++) {
			await this.login(credentials);
			
			// Wait a moment for the response
			await this.page.waitForTimeout(500);
			
			const errorMessage = await this.getErrorMessageText();
			if (errorMessage) {
				errorMessages.push(errorMessage);
			}
			
			// Clear form for next attempt
			await this.clearForm();
		}

		return errorMessages;
	}

	/**
	 * Assert that rate limiting is active
	 */
	async assertRateLimitingActive(): Promise<void> {
		const errorMessage = await this.getErrorMessageText();
		expect(errorMessage).toMatch(/too many.*attempts|rate.*limit|try.*again.*later/i);
	}

	/**
	 * Assert that account is locked
	 */
	async assertAccountLocked(): Promise<void> {
		const errorMessage = await this.getErrorMessageText();
		expect(errorMessage).toMatch(/account.*locked|temporarily.*locked|multiple.*failed/i);
	}
} 