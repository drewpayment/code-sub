import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// In-memory stores for rate limiting
const ipAttempts = new Map<string, { count: number; lastAttempt: number }>();
const accountAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_IP_ATTEMPTS = 5;
const MAX_ACCOUNT_ATTEMPTS = 5;

export const load: PageServerLoad = async ({ url }) => {
    const stripeSuccess = url.searchParams.has('stripe_success');
    return {
        stripeSuccess
    };
};

export const actions: Actions = {
    default: async ({ locals, request, url, getClientAddress }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const stripeSuccess = url.searchParams.has('stripe_success');
        const clientIP = getClientAddress();

        if (!email || !password) {
            return fail(400, {
                email,
                message: 'Email and password are required.'
            });
        }

        // Check IP-based rate limiting
        const now = Date.now();
        const ipKey = clientIP;
        const ipData = ipAttempts.get(ipKey);
        
        if (ipData) {
            // Reset count if window has expired
            if (now - ipData.lastAttempt > RATE_LIMIT_WINDOW) {
                ipAttempts.delete(ipKey);
            } else if (ipData.count >= MAX_IP_ATTEMPTS) {
                return fail(400, {
                    email,
                    message: 'Too many login attempts. Please try again in a few minutes.'
                });
            }
        }

        // Check account-based rate limiting
        const accountKey = email.toLowerCase();
        const accountData = accountAttempts.get(accountKey);
        
        if (accountData) {
            // Reset count if window has expired
            if (now - accountData.lastAttempt > RATE_LIMIT_WINDOW) {
                accountAttempts.delete(accountKey);
            } else if (accountData.count >= MAX_ACCOUNT_ATTEMPTS) {
                return fail(400, {
                    email,
                    message: 'Account temporarily locked due to multiple failed attempts. Please reset your password.'
                });
            }
        }

        try {
            await locals.pb.collection('users').authWithPassword(email, password);
            
            // Clear rate limiting data on successful login
            ipAttempts.delete(ipKey);
            accountAttempts.delete(accountKey);
            
        } catch (err) {
            console.error('Login Action Error:', err);
            
            // Increment IP attempts
            const currentIpData = ipAttempts.get(ipKey) || { count: 0, lastAttempt: now };
            ipAttempts.set(ipKey, {
                count: currentIpData.count + 1,
                lastAttempt: now
            });
            
            // Increment account attempts
            const currentAccountData = accountAttempts.get(accountKey) || { count: 0, lastAttempt: now };
            accountAttempts.set(accountKey, {
                count: currentAccountData.count + 1,
                lastAttempt: now
            });
            
            return fail(400, {
                email,
                message: 'The login credentials are invalid. Please try again.'
            });
        }

        // If user came from Stripe success, redirect back to subscription page
        if (stripeSuccess) {
            throw redirect(303, '/account/subscription?success=true');
        }

        throw redirect(303, '/');
    }
}; 