// Types for Subscription Management System

export type UserRole = 'customer' | 'employee' | 'manager' | 'admin' | 'super_admin';

export type BillingPeriod = 'monthly' | 'yearly' | 'one_time';

export type SubscriptionStatus = 'pending' | 'active' | 'cancelled' | 'suspended' | 'overdue';

// Enhanced User type with role
export interface User {
	id: string;
	email: string;
	name?: string;
	avatar?: string;
	role: UserRole;
	stripe_customer_id?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created: string;
	updated: string;
}

// Plan type
export interface Plan {
	id: string;
	name: string;
	description?: string;
	price: number;
	billing_period: BillingPeriod;
	features?: PlanFeatures;
	is_active?: boolean;
	stripe_price_id?: string;
	created: string;
	updated: string;
}

// Plan features structure (stored as JSON)
export interface PlanFeatures {
	[key: string]: string | number | boolean | string[] | undefined;
	// Common features that might be included:
	max_projects?: number;
	max_users?: number;
	support_level?: 'basic' | 'priority' | 'dedicated';
	integrations?: string[];
	custom_domain?: boolean;
	description?: string;
}

// Subscription type
export interface Subscription {
	id: string;
	customer_id: string;
	plan_id: string;
	status: SubscriptionStatus;
	start_date?: string;
	end_date?: string;
	stripe_subscription_id?: string;
	notes?: string;
	created: string;
	updated: string;
	// Expanded fields when fetching with relations
	expand?: {
		customer_id?: User;
		plan_id?: Plan;
	};
}

// Admin dashboard stats
export interface DashboardStats {
	total_customers: number;
	active_subscriptions: number;
	pending_subscriptions: number;
	monthly_revenue: number;
	new_customers_this_month: number;
}

// Permission helpers
export const ADMIN_ROLES: UserRole[] = ['employee', 'manager', 'admin', 'super_admin'];

export const MANAGER_ROLES: UserRole[] = ['manager', 'admin', 'super_admin'];

export const SUPER_ADMIN_ROLES: UserRole[] = ['super_admin'];

// Helper functions for role-based permissions
export function hasAdminAccess(role: UserRole): boolean {
	return ADMIN_ROLES.includes(role);
}

export function hasManagerAccess(role: UserRole): boolean {
	return MANAGER_ROLES.includes(role);
}

export function hasSuperAdminAccess(role: UserRole): boolean {
	return SUPER_ADMIN_ROLES.includes(role);
}

export function canManageSubscriptions(role: UserRole): boolean {
	return hasAdminAccess(role);
}

export function canViewAllCustomers(role: UserRole): boolean {
	return hasAdminAccess(role);
}

// Form types for creating/updating
export interface CreatePlanData {
	name: string;
	description?: string;
	price: number;
	billing_period: BillingPeriod;
	features?: PlanFeatures;
	is_active?: boolean;
}

export interface CreateSubscriptionData {
	customer_id: string;
	plan_id: string;
	status?: SubscriptionStatus;
	start_date?: string;
	end_date?: string;
	notes?: string;
}

export interface UpdateSubscriptionData {
	status?: SubscriptionStatus;
	start_date?: string;
	end_date?: string;
	notes?: string;
}

// API response types
export interface SubscriptionListResponse {
	items: Subscription[];
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
}

export interface CustomerListResponse {
	items: User[];
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
}

// Error types
export interface SubscriptionError {
	message: string;
	field?: string;
	code?: string;
} 