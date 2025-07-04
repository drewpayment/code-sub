<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import FormError from '$lib/components/FormError.svelte';

	export let form: ActionData;

	let loading = false;

	// Type guard for form data
	$: formData = form as { error?: string } | null;
</script>

<div class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full">
        <div class="text-center mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Create an Account</h1>
            <p class="text-gray-600">Join CodeSub to manage your services.</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-8">
            <form 
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}} 
				class="space-y-6"
			>
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                        id="name" 
                        name="name" 
                        type="text" 
                        required 
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Your Name"
                    />
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                    <input 
                        id="email" 
                        name="email" 
                        type="email" 
                        autocomplete="email" 
                        required 
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                        id="password" 
                        name="password" 
                        type="password" 
                        autocomplete="new-password" 
                        required 
                        minlength="8"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="8+ characters"
                    />
                </div>

                <div>
                    <label for="password-confirm" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input 
                        id="password-confirm" 
                        name="password-confirm" 
                        type="password" 
                        autocomplete="new-password" 
                        required 
                        minlength="8"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Confirm your password"
                    />
                </div>
                
                <FormError error={formData?.error} />

                <!-- Privacy Policy Disclaimer -->
                <div class="text-sm text-gray-600">
                    <p>
                        By signing up for an account, you agree to our 
                        <a href="/privacy-policy" target="_blank" class="font-medium text-blue-600 hover:text-blue-500">
                            Privacy Policy
                        </a>.
                    </p>
                </div>

                <div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </div>
            </form>
            
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Already have an account? 
                    <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    </div>
</div> 