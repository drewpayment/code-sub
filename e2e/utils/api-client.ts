import PocketBase from 'pocketbase';
import type { TestUser, TestSubscription, TestPlan } from '../types/test-types.js';

export class TestApiClient {
	private pb: PocketBase;

	constructor(baseUrl = 'http://localhost:8090') {
		this.pb = new PocketBase(baseUrl);
	}

	/**
	 * Create a test user in PocketBase
	 */
	async createUser(userData: Omit<TestUser, 'id'>): Promise<TestUser> {
		try {
			const user = await this.pb.collection('users').create({
				email: userData.email,
				password: userData.password,
				passwordConfirm: userData.password,
				username: userData.username || userData.email.split('@')[0],
				verified: userData.verified || false,
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
			await this.pb.admins.authWithPassword(
				process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com',
				process.env.POCKETBASE_ADMIN_PASSWORD || 'admin123456'
			);
		} catch (error) {
			console.error('Failed to authenticate as admin:', error);
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
				interval: planData.interval,
				stripePriceId: planData.stripePriceId || `price_test_${Date.now()}`,
				features: planData.features,
				active: planData.active,
			});

			return {
				id: plan.id,
				name: plan.name,
				description: plan.description,
				price: plan.price,
				interval: plan.interval,
				stripePriceId: plan.stripePriceId,
				features: plan.features,
				active: plan.active,
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
				userId: subscriptionData.userId,
				planId: subscriptionData.planId,
				status: subscriptionData.status,
				stripeSubscriptionId: subscriptionData.stripeSubscriptionId || `sub_test_${Date.now()}`,
				currentPeriodStart: subscriptionData.currentPeriodStart || new Date().toISOString(),
				currentPeriodEnd: subscriptionData.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
			});

			return {
				id: subscription.id,
				userId: subscription.userId,
				planId: subscription.planId,
				status: subscription.status,
				stripeSubscriptionId: subscription.stripeSubscriptionId,
				currentPeriodStart: subscription.currentPeriodStart,
				currentPeriodEnd: subscription.currentPeriodEnd,
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
				filter: `userId = "${userId}"`
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