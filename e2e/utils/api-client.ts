import PocketBase from 'pocketbase';
import type { TestUser, TestSubscription, TestPlan } from '../types/test-types.js';

export class TestApiClient {
	private pb: PocketBase;

	constructor(baseUrl?: string) {
		// Use environment variable for CI, fallback to localhost for local development
		const pocketBaseUrl = baseUrl || process.env.PB_URL || 'http://localhost:8090';
		this.pb = new PocketBase(pocketBaseUrl);
	}

	/**
	 * Create a test user in PocketBase
	 */
	async createUser(userData: Omit<TestUser, 'id'>): Promise<TestUser> {
		try {
			// Authenticate as admin before creating users (required by PocketBase permissions)
			await this.authenticateAsAdmin();
			
			const user = await this.pb.collection('users').create({
				email: userData.email,
				password: userData.password,
				passwordConfirm: userData.password,
				name: userData.username || userData.email.split('@')[0], // Use name field as required by registration
				verified: userData.verified || false,
				role: 'customer' // Required field - default test users to customer role
			});

			return {
				id: user.id,
				email: user.email,
				password: userData.password, // Keep original password for tests
				username: user.username,
				verified: user.verified,
				created: user.created,
				updated: user.updated,
			};
		} catch (error) {
			console.error('Failed to create test user:', error);
			throw new Error(`Failed to create test user: ${error}`);
		}
	}

	/**
	 * Delete a test user from PocketBase
	 */
	async deleteUser(userId: string): Promise<void> {
		try {
			await this.pb.collection('users').delete(userId);
		} catch (error) {
			console.error('Failed to delete test user:', error);
			// Don't throw here - cleanup should be resilient
		}
	}

	/**
	 * Authenticate as admin for privileged operations
	 */
	async authenticateAsAdmin(): Promise<void> {
		try {
			// Use the same environment variable names as in CI and the main app
			const adminEmail = process.env.PB_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com';
			const adminPassword = process.env.PB_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD || 'admin123456';
			
			await this.pb.admins.authWithPassword(adminEmail, adminPassword);
		} catch (error) {
			console.error('Failed to authenticate as admin:', error);
			console.error('Admin email:', process.env.PB_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com');
			throw new Error(`Failed to authenticate as admin: ${error}`);
		}
	}

	/**
	 * Authenticate as a regular user
	 */
	async authenticateAsUser(email: string, password: string): Promise<TestUser> {
		try {
			const authData = await this.pb.collection('users').authWithPassword(email, password);
			return {
				id: authData.record.id,
				email: authData.record.email,
				password: password,
				username: authData.record.username,
				verified: authData.record.verified,
				created: authData.record.created,
				updated: authData.record.updated,
			};
		} catch (error) {
			console.error('Failed to authenticate user:', error);
			throw new Error(`Failed to authenticate user: ${error}`);
		}
	}

	/**
	 * Create a test subscription plan
	 */
	async createPlan(planData: Omit<TestPlan, 'id'>): Promise<TestPlan> {
		try {
			await this.authenticateAsAdmin();
			const plan = await this.pb.collection('plans').create({
				name: planData.name,
				description: planData.description,
				price: planData.price,
				billing_period: planData.interval, // Use correct field name from schema
				stripe_price_id: planData.stripePriceId || `price_test_${Date.now()}`, // Use correct field name
				features: planData.features,
				is_active: planData.active, // Use correct field name from schema
			});

			return {
				id: plan.id,
				name: plan.name,
				description: plan.description,
				price: plan.price,
				interval: plan.billing_period, // Map back to expected interface
				stripePriceId: plan.stripe_price_id, // Map back to expected interface
				features: plan.features,
				active: plan.is_active, // Map back to expected interface
				created: plan.created,
				updated: plan.updated,
			};
		} catch (error) {
			console.error('Failed to create test plan:', error);
			throw new Error(`Failed to create test plan: ${error}`);
		}
	}

	/**
	 * Delete a test plan
	 */
	async deletePlan(planId: string): Promise<void> {
		try {
			await this.authenticateAsAdmin();
			await this.pb.collection('plans').delete(planId);
		} catch (error) {
			console.error('Failed to delete test plan:', error);
			// Don't throw here - cleanup should be resilient
		}
	}

	/**
	 * Create a test subscription
	 */
	async createSubscription(subscriptionData: Omit<TestSubscription, 'id'>): Promise<TestSubscription> {
		try {
			await this.authenticateAsAdmin();
			const subscription = await this.pb.collection('subscriptions').create({
				customer_id: subscriptionData.userId, // Use correct field name from schema
				plan_id: subscriptionData.planId, // Use correct field name from schema
				status: subscriptionData.status,
				stripe_subscription_id: subscriptionData.stripeSubscriptionId || `sub_test_${Date.now()}`, // Use correct field name
				start_date: subscriptionData.currentPeriodStart ? subscriptionData.currentPeriodStart.split('T')[0] : new Date().toISOString().split('T')[0], // Date format YYYY-MM-DD
				end_date: subscriptionData.currentPeriodEnd ? subscriptionData.currentPeriodEnd.split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Date format YYYY-MM-DD
			});

			return {
				id: subscription.id,
				userId: subscription.customer_id, // Map back to expected interface
				planId: subscription.plan_id, // Map back to expected interface
				status: subscription.status,
				stripeSubscriptionId: subscription.stripe_subscription_id, // Map back to expected interface
				currentPeriodStart: subscription.start_date, // Map back to expected interface
				currentPeriodEnd: subscription.end_date, // Map back to expected interface
				created: subscription.created,
				updated: subscription.updated,
			};
		} catch (error) {
			console.error('Failed to create test subscription:', error);
			throw new Error(`Failed to create test subscription: ${error}`);
		}
	}

	/**
	 * Delete a test subscription
	 */
	async deleteSubscription(subscriptionId: string): Promise<void> {
		try {
			await this.authenticateAsAdmin();
			await this.pb.collection('subscriptions').delete(subscriptionId);
		} catch (error) {
			console.error('Failed to delete test subscription:', error);
			// Don't throw here - cleanup should be resilient
		}
	}

	/**
	 * Clean up all test data for a user
	 */
	async cleanupUserData(userId: string): Promise<void> {
		try {
			await this.authenticateAsAdmin();
			
			// Delete subscriptions first (due to foreign key constraints)
			const subscriptions = await this.pb.collection('subscriptions').getFullList({
				filter: `customer_id = "${userId}"` // Use correct field name from schema
			});
			
			for (const subscription of subscriptions) {
				await this.deleteSubscription(subscription.id);
			}
			
			// Then delete the user
			await this.deleteUser(userId);
		} catch (error) {
			console.error('Failed to cleanup user data:', error);
			// Don't throw here - cleanup should be resilient
		}
	}

	/**
	 * Generate unique test email
	 */
	generateTestEmail(prefix = 'test'): string {
		const timestamp = Date.now();
		const random = Math.random().toString(36).substring(2, 8);
		return `${prefix}_${timestamp}_${random}@playwright.test`;
	}

	/**
	 * Generate test password
	 */
	generateTestPassword(): string {
		return 'TestPassword123!';
	}
} 