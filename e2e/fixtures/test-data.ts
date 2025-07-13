import { test as base, expect } from '@playwright/test';
import { TestApiClient } from '../utils/api-client.js';
import type { TestUser, TestContext } from '../types/test-types.js';

// Extend the base test with our fixtures
export const test = base.extend<{
	testUser: TestUser;
	testApiClient: TestApiClient;
	testContext: TestContext;
}>({
	// API client fixture - creates a new client for each test
	testApiClient: async (_, use) => {
		const apiClient = new TestApiClient();
		await use(apiClient);
	},

	// Test user fixture - creates and cleans up a test user
	testUser: async ({ testApiClient }, use) => {
		let user: TestUser | undefined;
		
		try {
			// Create a unique test user
			const userData = {
				email: testApiClient.generateTestEmail('e2e'),
				password: testApiClient.generateTestPassword(),
				verified: true
			};

			user = await testApiClient.createUser(userData);
			
			// Provide the user to the test
			await use(user);
		} catch (error) {
			console.error('Failed to create test user:', error);
			throw error;
		} finally {
			// Cleanup: Delete the test user and all associated data
			if (user?.id) {
				await testApiClient.cleanupUserData(user.id);
			}
		}
	},

	// Test context fixture - provides a complete test context with user, plans, etc.
	testContext: async ({ testApiClient }, use) => {
		const context: TestContext = {};
		
		try {
			// Create a test user
			const userData = {
				email: testApiClient.generateTestEmail('context'),
				password: testApiClient.generateTestPassword(),
				verified: true
			};

			context.user = await testApiClient.createUser(userData);

			// Create a test plan (if needed for subscription tests)
			context.plan = await testApiClient.createPlan({
				name: 'Test Plan',
				description: 'A test subscription plan',
				price: 999, // $9.99 in cents
				interval: 'month',
				features: ['Feature 1', 'Feature 2'],
				active: true
			});

			await use(context);
		} catch (error) {
			console.error('Failed to create test context:', error);
			throw error;
		} finally {
			// Cleanup: Delete all test data
			if (context.user?.id) {
				await testApiClient.cleanupUserData(context.user.id);
			}
			if (context.plan?.id) {
				await testApiClient.deletePlan(context.plan.id);
			}
		}
	}
});

// Export expect from Playwright
export { expect };

// Helper functions for common test data scenarios
export class TestDataHelpers {
	static readonly VALID_PASSWORDS = [
		'ValidPassword123!',
		'AnotherGood1@',
		'StrongP@ssw0rd'
	];

	static readonly INVALID_PASSWORDS = [
		'weak',
		'12345678',
		'password',
		'PASSWORD',
		'Password',
		'Pass123'  // Missing special character
	];

	static readonly INVALID_EMAILS = [
		'invalid-email',
		'@example.com',
		'user@',
		'user..name@example.com',
		'user name@example.com'
	];

	/**
	 * Generate test registration data
	 */
	static generateRegistrationData(apiClient: TestApiClient) {
		const password = apiClient.generateTestPassword();
		return {
			email: apiClient.generateTestEmail('reg'),
			password: password,
			confirmPassword: password
		};
	}

	/**
	 * Generate test login credentials
	 */
	static generateLoginCredentials(apiClient: TestApiClient) {
		return {
			email: apiClient.generateTestEmail('login'),
			password: apiClient.generateTestPassword()
		};
	}

	/**
	 * Generate invalid registration data for validation tests
	 */
	static generateInvalidRegistrationData() {
		return [
			{
				name: 'Invalid email',
				data: {
					email: 'invalid-email',
					password: 'ValidPassword123!',
					confirmPassword: 'ValidPassword123!'
				}
			},
			{
				name: 'Weak password',
				data: {
					email: 'test@example.com',
					password: 'weak',
					confirmPassword: 'weak'
				}
			},
			{
				name: 'Password mismatch',
				data: {
					email: 'test@example.com',
					password: 'ValidPassword123!',
					confirmPassword: 'DifferentPassword123!'
				}
			},
			{
				name: 'Empty email',
				data: {
					email: '',
					password: 'ValidPassword123!',
					confirmPassword: 'ValidPassword123!'
				}
			},
			{
				name: 'Empty password',
				data: {
					email: 'test@example.com',
					password: '',
					confirmPassword: ''
				}
			}
		];
	}

	/**
	 * Generate multiple test users for bulk operations
	 */
	static async createMultipleUsers(apiClient: TestApiClient, count: number): Promise<TestUser[]> {
		const users: TestUser[] = [];
		
		for (let i = 0; i < count; i++) {
			const userData = {
				email: apiClient.generateTestEmail(`bulk_${i}`),
				password: apiClient.generateTestPassword(),
				verified: true
			};
			
			const user = await apiClient.createUser(userData);
			users.push(user);
		}
		
		return users;
	}

	/**
	 * Cleanup multiple test users
	 */
	static async cleanupMultipleUsers(apiClient: TestApiClient, users: TestUser[]): Promise<void> {
		for (const user of users) {
			if (user.id) {
				await apiClient.cleanupUserData(user.id);
			}
		}
	}
} 