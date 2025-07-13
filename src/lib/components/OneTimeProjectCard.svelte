<script>
	export let plan;

	// Helper function to format features as an array
	function getFeatures(plan) {
		if (!plan.features) return [];
		
		// If features is already an array, return it
		if (Array.isArray(plan.features)) {
			return plan.features;
		}
		
		// If features is an object, try to extract meaningful values
		if (typeof plan.features === 'object') {
			const features = plan.features;
			if (features.description) {
				return [features.description];
			}
			// Extract all string values from the object
			return Object.values(features).filter(value => typeof value === 'string');
		}
		
		return [];
	}

	$: features = getFeatures(plan);
	$: priceRange = `$${plan.price_min?.toLocaleString()} - $${plan.price_max?.toLocaleString()}`;
</script>

<div class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 h-full flex flex-col">
	<!-- Header -->
	<div class="text-center mb-6">
		<h3 class="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
		<div class="text-2xl font-bold text-blue-600 mb-4">{priceRange}</div>
		{#if plan.description}
			<p class="text-gray-600 text-sm">{plan.description}</p>
		{/if}
	</div>

	<!-- Features List -->
	{#if features.length > 0}
		<div class="flex-1">
			<h4 class="text-sm font-medium text-gray-900 mb-3">What's Included:</h4>
			<ul class="space-y-2">
				{#each features as feature}
					<li class="flex items-start">
						<svg class="flex-shrink-0 h-4 w-4 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
						<span class="text-sm text-gray-700">{feature}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- CTA Button -->
	<div class="mt-6">
		<a 
			href="/contact" 
			class="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 block"
		>
			Get Quote
		</a>
	</div>
</div> 