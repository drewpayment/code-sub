<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from './FormError.svelte';

	// Generalize the form prop to make the component more reusable
	export let form: {
		data?: { [key: string]: any };
		errors?: { [key: string]: string[] };
		error?: string;
	} | null = null;

	// Add source and plan props
	export let source: string = '';
	export let plan: string = '';

	let loading = false;

	// Svelte can't bind to an optional-chained property.
	// We ensure data is an object so we can bind to its properties.
	let data = form?.data || {};
</script>

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
		<!-- Hidden fields for source and plan -->
		{#if source}
			<input type="hidden" name="source" value={source} />
		{/if}
		{#if plan}
			<input type="hidden" name="plan" value={plan} />
		{/if}

		<div>
			<label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
			<input 
				id="name" 
				name="name" 
				type="text" 
				required 
				bind:value={data.name}
				class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				class:border-red-500={form?.errors?.name}
				aria-invalid={form?.errors?.name ? 'true' : undefined}
				placeholder="John Doe"
			/>
			{#if form?.errors?.name}
				<div class="mt-2 text-sm text-red-600">
					{#each form.errors.name as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}
		</div>

		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
			<input 
				id="email" 
				name="email" 
				type="email" 
				required 
				bind:value={data.email}
				class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				class:border-red-500={form?.errors?.email}
				aria-invalid={form?.errors?.email ? 'true' : undefined}
				placeholder="you@example.com"
			/>
			{#if form?.errors?.email}
				<div class="mt-2 text-sm text-red-600">
					{#each form.errors.email as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}
		</div>

		<div>
			<label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
			<input 
				id="phone" 
				name="phone" 
				type="tel" 
				bind:value={data.phone}
				class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				class:border-red-500={form?.errors?.phone}
				aria-invalid={form?.errors?.phone ? 'true' : undefined}
				placeholder="(555) 555-5555"
			/>
			{#if form?.errors?.phone}
				<div class="mt-2 text-sm text-red-600">
					{#each form.errors.phone as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}
		</div>

		<div>
			<label for="description" class="block text-sm font-medium text-gray-700">Project Description (Optional)</label>
			<textarea 
				id="description" 
				name="description" 
				rows="4"
				bind:value={data.description}
				class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				class:border-red-500={form?.errors?.description}
				aria-invalid={form?.errors?.description ? 'true' : undefined}
				placeholder="Tell us about your project..."
			></textarea>
			{#if form?.errors?.description}
				<div class="mt-2 text-sm text-red-600">
					{#each form.errors.description as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}
		</div>
		
		<FormError error={form?.error} />

		<div>
			<button 
				type="submit" 
				disabled={loading}
				class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? 'Sending Message...' : 'Send Message'}
			</button>
		</div>
	</form>
</div> 