import { test, expect, TestDataHelpers } from '../fixtures/test-data.js';
import { LoginPage } from '../pages/login-page.js';
import { RegistrationPage } from '../pages/registration-page.js';

test.describe('Authentication', () => {
	test.describe('User Registration', () => {
		test('should register a new user successfully', async ({ page, testApiClient }) => {
			const registrationPage = new RegistrationPage(page);
			const registrationData = TestDataHelpers.generateRegistrationData(testApiClient);

			await registrationPage.navigate();
			await registrationPage.assertRegistrationFormVisible();

			await registrationPage.registerSuccessfully(registrationData);
			await registrationPage.assertSuccessfulRegistration();
		});

		test('should show validation errors for invalid email', async ({ page }) => {
			const registrationPage = new RegistrationPage(page);
			
			await registrationPage.navigate();

			const errorMessages = await registrationPage.testEmailValidation(TestDataHelpers.INVALID_EMAILS);
			
			// Should have received error messages for invalid emails
			expect(errorMessages.length).toBeGreaterThan(0);
			
			// Check that error messages mention email validation
			for (const errorMessage of errorMessages) {
				expect(errorMessage.toLowerCase()).toMatch(/email|invalid|format/);
			}
		});

		test('should show validation errors for weak passwords', async ({ page }) => {
			const registrationPage = new RegistrationPage(page);
			
			await registrationPage.navigate();

			const errorMessages = await registrationPage.testPasswordValidation(TestDataHelpers.INVALID_PASSWORDS);
			
			// Should have received error messages for weak passwords
			expect(errorMessages.length).toBeGreaterThan(0);
			
			// Check that error messages mention password requirements
			for (const errorMessage of errorMessages) {
				expect(errorMessage.toLowerCase()).toMatch(/password|weak|strength|character/);
			}
		});

		test('should show error for password mismatch', async ({ page }) => {
			const registrationPage = new RegistrationPage(page);
			
			await registrationPage.navigate();

			const errorMessage = await registrationPage.testPasswordMismatch();
			
			expect(errorMessage.toLowerCase()).toMatch(/password.*match|confirm.*password|passwords.*different/);
		});

		test('should show error when registering with existing email', async ({ page, testUser }) => {
			const registrationPage = new RegistrationPage(page);
			
			await registrationPage.navigate();

			const errorMessage = await registrationPage.testExistingEmailRegistration(testUser.email);
			
			expect(errorMessage.toLowerCase()).toMatch(/email.*exist|already.*registered|account.*exist/);
		});

		test('should display privacy policy link', async ({ page }) => {
			const registrationPage = new RegistrationPage(page);
			
			await registrationPage.navigate();
			await registrationPage.assertPrivacyPolicyLinkVisible();
			
			// Test clicking the privacy policy link
			await registrationPage.clickPrivacyPolicy();
			// The privacy policy should be accessible (either in new tab or same tab)
		});
	});

	test.describe('User Login', () => {
		test('should login successfully with valid credentials', async ({ page, testUser }) => {
			const loginPage = new LoginPage(page);
			
			await loginPage.navigate();
			await loginPage.assertLoginFormVisible();

			await loginPage.loginSuccessfully({
				email: testUser.email,
				password: testUser.password
			});

			// Should be redirected to account page
			await expect(page).toHaveURL(/.*\/account.*/);
		});

		test('should show error for invalid credentials', async ({ page, testApiClient }) => {
			const loginPage = new LoginPage(page);
			const invalidCredentials = {
				email: testApiClient.generateTestEmail('invalid'),
				password: 'WrongPassword123!'
			};
			
			await loginPage.navigate();

			const errorMessage = await loginPage.loginWithError(invalidCredentials);
			
			expect(errorMessage.toLowerCase()).toMatch(/invalid.*credentials|login.*failed|incorrect.*password/);
		});

		test('should preserve email field after failed login', async ({ page, testApiClient }) => {
			const loginPage = new LoginPage(page);
			const invalidCredentials = {
				email: testApiClient.generateTestEmail('preserve'),
				password: 'WrongPassword123!'
			};
			
			await loginPage.navigate();

			await loginPage.loginWithError(invalidCredentials);
			
			// Email should be preserved, password should be cleared
			await loginPage.assertFormFieldsPreserved(invalidCredentials.email);
		});

		test('should implement rate limiting after multiple failed attempts', async ({ page, testApiClient }) => {
			const loginPage = new LoginPage(page);
			const invalidCredentials = {
				email: testApiClient.generateTestEmail('ratelimit'),
				password: 'WrongPassword123!'
			};
			
			await loginPage.navigate();

			// Perform multiple rapid login attempts (6 attempts to trigger rate limiting)
			const errorMessages = await loginPage.performRapidLoginAttempts(invalidCredentials, 6);
			
			// Should eventually get a rate limiting error
			const rateLimitMessage = errorMessages.find(msg => 
				msg.toLowerCase().match(/too many.*attempts|rate.*limit|try.*again.*later/)
			);
			
			expect(rateLimitMessage).toBeTruthy();
		});

		test('should lock account after multiple failed attempts', async ({ page, testUser }) => {
			const loginPage = new LoginPage(page);
			const invalidCredentials = {
				email: testUser.email,
				password: 'WrongPassword123!'
			};
			
			await loginPage.navigate();

			// Perform multiple failed login attempts (5+ to trigger account lockout)
			const errorMessages = await loginPage.performRapidLoginAttempts(invalidCredentials, 6);
			
			// Should eventually get an account locked error
			const lockoutMessage = errorMessages.find(msg => 
				msg.toLowerCase().match(/account.*locked|temporarily.*locked|multiple.*failed/)
			);
			
			expect(lockoutMessage).toBeTruthy();
		});

		test('should navigate to registration page', async ({ page }) => {
			const loginPage = new LoginPage(page);
			
			await loginPage.navigate();
			await loginPage.clickRegister();
			
			await expect(page).toHaveURL(/.*\/register.*/);
		});

		test('should navigate to forgot password page', async ({ page }) => {
			const loginPage = new LoginPage(page);
			
			await loginPage.navigate();
			await loginPage.clickForgotPassword();
			
			await expect(page).toHaveURL(/.*\/forgot-password.*/);
		});
	});

	test.describe('Password Reset Flow', () => {
		test('should display forgot password form', async ({ page }) => {
			await page.goto('/forgot-password');
			await page.waitForLoadState('networkidle');
			
			// Check that the forgot password form is visible
			await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
			await expect(page.locator('button[type="submit"], button:has-text("Reset"), button:has-text("Send")')).toBeVisible();
		});

		test('should show validation error for invalid email in forgot password', async ({ page }) => {
			await page.goto('/forgot-password');
			await page.waitForLoadState('networkidle');
			
			// Try to submit with invalid email
			await page.locator('input[type="email"], input[name="email"]').fill('invalid-email');
			await page.locator('button[type="submit"], button:has-text("Reset"), button:has-text("Send")').click();
			
			// Should show validation error
			const errorMessage = await page.locator('.error-message, .alert-error, .text-red-500, [role="alert"]').textContent();
			expect(errorMessage?.toLowerCase()).toMatch(/email|invalid|format/);
		});

		test('should handle forgot password request for existing user', async ({ page, testUser }) => {
			await page.goto('/forgot-password');
			await page.waitForLoadState('networkidle');
			
			// Submit forgot password form with existing user email
			await page.locator('input[type="email"], input[name="email"]').fill(testUser.email);
			await page.locator('button[type="submit"], button:has-text("Reset"), button:has-text("Send")').click();
			
			// Should show success message or redirect
			try {
				// Either success message appears
				await expect(page.locator('.success-message, .alert-success, .text-green-500')).toBeVisible({ timeout: 5000 });
			} catch {
				// Or we get redirected to login with a message
				await expect(page).toHaveURL(/.*\/login.*/);
			}
		});
	});

	test.describe('Navigation and UI', () => {
		test('should display login form elements correctly', async ({ page }) => {
			const loginPage = new LoginPage(page);
			
			await loginPage.navigate();
			
			// Check all form elements are present
			await loginPage.assertLoginFormVisible();
			
			// Check navigation links
			await expect(page.locator('a:has-text("Register"), a:has-text("Sign up")')).toBeVisible();
			await expect(page.locator('a:has-text("Forgot"), a[href*="forgot"]')).toBeVisible();
		});

		test('should display registration form elements correctly', async ({ page }) => {
			const registrationPage = new RegistrationPage(page);
			
			await registrationPage.navigate();
			
			// Check all form elements are present
			await registrationPage.assertRegistrationFormVisible();
			
			// Check navigation links
			await expect(page.locator('a:has-text("Login"), a:has-text("Sign in")')).toBeVisible();
			await registrationPage.assertPrivacyPolicyLinkVisible();
		});

		test('should have proper page titles', async ({ page }) => {
			// Test login page title
			await page.goto('/login');
			const loginTitle = await page.title();
			expect(loginTitle.toLowerCase()).toMatch(/login|sign in/);
			
			// Test registration page title
			await page.goto('/register');
			const registerTitle = await page.title();
			expect(registerTitle.toLowerCase()).toMatch(/register|sign up|create account/);
		});
	});
}); 