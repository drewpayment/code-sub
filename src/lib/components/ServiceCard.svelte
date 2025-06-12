<script lang="ts">
	import Check from './Check.svelte';

	export let title: string;
	export let idealFor: string;
	export let features: string[];
	export let priceRange: string;
</script>

<div class="card flex flex-col h-full border-2 hover:border-blue-500 transition-all duration-300">
	<div class="flex-grow">
		<h3 class="text-2xl font-bold text-gray-800">{title}</h3>
		<p class="text-sm text-gray-500 mt-2 mb-4">{priceRange}</p>
		<p class="text-gray-600 mb-6">{idealFor}</p>

		<ul class="space-y-3">
			{#each features as feature}
				<li class="flex items-start">
					<div class="flex-shrink-0">
						<Check class="h-5 w-5 text-green-500 mt-1" />
					</div>
					<span class="ml-3 text-gray-700">{feature}</span>
				</li>
			{/each}
		</ul>
	</div>
</div> 