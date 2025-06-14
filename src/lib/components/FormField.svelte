<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export let value: string | undefined = undefined;
	export let name: string;
	export let label: string;
	export let errors: string[] | undefined = undefined;
	export let placeholder: string = '';
	export let type: 'text' | 'email' | 'tel' | 'textarea' = 'text';
</script>

<div class="mb-4">
	<label for={name} class="block text-sm font-medium text-gray-700">{label}</label>
	<div class="mt-1">
		{#if type === 'textarea'}
			<textarea
				{name}
				id={name}
				class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
				class:border-red-500={errors}
				aria-invalid={errors ? 'true' : undefined}
				bind:value
				{placeholder}
			></textarea>
		{:else}
			<input
				{type}
				{name}
				id={name}
				class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
				class:border-red-500={errors}
				aria-invalid={errors ? 'true' : undefined}
				bind:value
				{placeholder}
			/>
		{/if}
	</div>
	{#if errors}
		<div class="mt-2 text-sm text-red-600" id={`${name}-error`}>
			{#each errors as error}
				<p>{error}</p>
			{/each}
		</div>
	{/if}
</div> 