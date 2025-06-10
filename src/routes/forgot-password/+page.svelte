<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import FormError from '$lib/components/FormError.svelte';

	let email = '';
	let loading = false;
	let message = '';
	let error: string | null = null;

	async function handlePasswordReset() {
		loading = true;
		error = null;
		message = '';

		try {
			await pb.collection('users').requestPasswordReset(email);
			message = 'If an account with this email exists, a password reset link has been sent.';
		} catch (e: any) {
			// Even in case of an error, we show a generic success message
			// to prevent leaking information about which emails are registered.
			message = 'If an account with this email exists, a password reset link has been sent.';
			console.error('Password Reset Error:', e);
		} finally {
			loading = false;
			email = ''; // Clear the input field
		}
	}
</script>

<div class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full">
        <div class="text-center mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p class="text-gray-600">Enter your email to receive a reset link.</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-8">
            {#if message}
                <p class="text-center text-green-600 bg-green-50 p-4 rounded-md mb-6">{message}</p>
                <div class="text-center">
                    <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
                        Back to Sign In
                    </a>
                </div>
            {:else}
                <form on:submit|preventDefault={handlePasswordReset} class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <input 
                            id="email" 
                            name="email" 
                            type="email" 
                            autocomplete="email" 
                            required 
                            bind:value={email}
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="you@example.com"
                        />
                    </div>
                    
                    <FormError {error} />
                    
                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        Remember your password? 
                        <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
                            Sign In
                        </a>
                    </p>
                </div>
            {/if}
        </div>
    </div>
</div> 