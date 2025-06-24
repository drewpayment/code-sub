/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import type { User, Plan, Subscription, UserRole } from './types/subscription';

export const pb = new PocketBase('https://pocketbase.hoytlabs.cloud');

export const currentUser = writable<User | null>(pb.authStore.model as User | null);

pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model as User | null);
});

// Collection names
export const COLLECTIONS = {
	USERS: 'users',
	PLANS: 'plans',
	SUBSCRIPTIONS: 'subscriptions',
	CONTACT_SUBMISSIONS: 'contact_submissions'
} as const;

// Typed collection helpers
export class SubscriptionService {
	// Plans
	static async getPlans(activeOnly = false) {
		const filter = activeOnly ? 'is_active = true' : '';
		return pb.collection(COLLECTIONS.PLANS).getFullList<Plan>({
			filter,
			sort: 'price'
		});
	}

	static async getPlan(id: string) {
		return pb.collection(COLLECTIONS.PLANS).getOne<Plan>(id);
	}

	static async createPlan(data: Omit<Plan, 'id' | 'created' | 'updated'>) {
		return pb.collection(COLLECTIONS.PLANS).create<Plan>(data);
	}

	static async updatePlan(id: string, data: Partial<Plan>) {
		return pb.collection(COLLECTIONS.PLANS).update<Plan>(id, data);
	}

	// Subscriptions
	static async getSubscriptions(options?: {
		page?: number;
		perPage?: number;
		filter?: string;
		expand?: string;
	}) {
		return pb.collection(COLLECTIONS.SUBSCRIPTIONS).getList<Subscription>(
			options?.page || 1,
			options?.perPage || 50,
			{
				filter: options?.filter,
				expand: options?.expand || 'customer_id,plan_id',
				sort: '-created'
			}
		);
	}

	static async getSubscription(id: string) {
		return pb.collection(COLLECTIONS.SUBSCRIPTIONS).getOne<Subscription>(id, {
			expand: 'customer_id,plan_id'
		});
	}

	static async createSubscription(data: Omit<Subscription, 'id' | 'created' | 'updated'>) {
		return pb.collection(COLLECTIONS.SUBSCRIPTIONS).create<Subscription>(data);
	}

	static async updateSubscription(id: string, data: Partial<Subscription>) {
		return pb.collection(COLLECTIONS.SUBSCRIPTIONS).update<Subscription>(id, data);
	}

	static async deleteSubscription(id: string) {
		return pb.collection(COLLECTIONS.SUBSCRIPTIONS).delete(id);
	}

	// Users/Customers
	static async getCustomers(options?: {
		page?: number;
		perPage?: number;
		filter?: string;
	}) {
		const filter = options?.filter 
			? `role = "customer" && (${options.filter})`
			: `role = 'customer'`;
			
		return pb.collection(COLLECTIONS.USERS).getList<User>(
			options?.page || 1,
			options?.perPage || 50,
			{
				filter,
				sort: '-created'
			}
		);
	}

	static async getUser(id: string) {
		return pb.collection(COLLECTIONS.USERS).getOne<User>(id);
	}

	static async updateUserRole(id: string, role: UserRole) {
		return pb.collection(COLLECTIONS.USERS).update<User>(id, { role });
	}

	static async createCustomer(data: {
		email: string;
		name?: string;
		role?: UserRole;
		password: string;
		passwordConfirm: string;
	}) {
		return pb.collection(COLLECTIONS.USERS).create<User>({
			...data,
			role: data.role || 'customer'
		});
	}

	// Dashboard stats
	static async getDashboardStats() {
		// These would need to be implemented as custom endpoints or calculated client-side
		// For now, we'll return basic counts
		const [customers, activeSubscriptions, pendingSubscriptions] = await Promise.all([
			pb.collection(COLLECTIONS.USERS).getList(1, 1, { filter: 'role = "customer"' }),
			pb.collection(COLLECTIONS.SUBSCRIPTIONS).getList(1, 1, { filter: 'status = "active"', requestKey: null }),
			pb.collection(COLLECTIONS.SUBSCRIPTIONS).getList(1, 1, { filter: 'status = "pending"', requestKey: null }),
		]);

		return {
			total_customers: customers.totalItems,
			active_subscriptions: activeSubscriptions.totalItems,
			pending_subscriptions: pendingSubscriptions.totalItems,
			monthly_revenue: 0, // Would need custom calculation
			new_customers_this_month: 0 // Would need custom calculation
		};
	}
}

// Helper to check if current user has admin access
export function hasCurrentUserAdminAccess(): boolean {
	const user = pb.authStore.model as User | null;
	if (!user) return false;
	
	const adminRoles: UserRole[] = ['employee', 'manager', 'admin', 'super_admin'];
	return adminRoles.includes(user.role);
}

// Helper to get current user role
export function getCurrentUserRole(): UserRole | null {
	const user = pb.authStore.model as User | null;
	return user?.role || null;
} 