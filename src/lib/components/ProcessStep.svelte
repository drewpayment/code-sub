<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let icon: typeof SvelteComponent;
	export let title: string;
	export let description: string;
	export let stepNumber: number;
	export let isLast: boolean = false;
</script>

<div class="flex">
	<div class="flex flex-col items-center mr-6">
		<div
			class="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 border-2 border-blue-200"
		>
			<svelte:component this={icon} class="w-6 h-6" />
		</div>
		{#if !isLast}
			<div class="w-px h-full bg-gray-300"></div>
		{/if}
	</div>
	<div class="pb-10">
		<p class="text-sm font-semibold text-blue-600">Step {stepNumber}</p>
		<h3 class="text-xl font-bold text-gray-800 mt-1">{title}</h3>
		<p class="mt-2 text-gray-600">
			{description}
		</p>
	</div>
</div> 