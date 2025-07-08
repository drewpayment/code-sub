export interface TestUser {
	id?: string;
	email: string;
	password: string;
	username?: string;
	verified?: boolean;
	created?: string;
	updated?: string;
}

export interface TestSubscription {
	id?: string;
	userId: string;
	planId: string;
	status: 'active' | 'cancelled' | 'past_due' | 'trialing';
	stripeSubscriptionId?: string;
	currentPeriodStart?: string;
	currentPeriodEnd?: string;
	created?: string;
	updated?: string;
}

export interface TestPlan {
	id?: string;
	name: string;
	description: string;
	price: number;
	interval: 'month' | 'year';
	stripePriceId?: string;
	features: string[];
	active: boolean;
	created?: string;
	updated?: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegistrationData {
	email: string;
	password: string;
	confirmPassword: string;
}

export interface TestContext {
	user?: TestUser;
	subscription?: TestSubscription;
	plan?: TestPlan;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
} 