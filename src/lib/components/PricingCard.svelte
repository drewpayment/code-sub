<script lang="ts">
  type Tier = {
    name: string;
    description: string;
    price: string;
    features: string[];
    href: string;
    popular?: boolean;
  };

  let { tier }: { tier: Tier } = $props();
</script>

<div class="card h-full flex flex-col" class:ring-2={tier.popular} class:ring-blue-600={tier.popular} class:relative={tier.popular}>
  {#if tier.popular}
    <div class="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
        Most Popular
      </span>
    </div>
  {/if}
  <div class="p-6 flex-grow">
    <h3 class="text-xl font-bold text-gray-900 mb-3">{tier.name}</h3>
    <p class="text-gray-600 mb-4">{tier.description}</p>
    <p class="text-4xl font-extrabold text-gray-900 mb-4">
      {tier.price}<span class="text-base font-medium text-gray-500">/mo</span>
    </p>
    <ul class="space-y-3 text-gray-600">
      {#each tier.features as feature, i}
        <li class="flex items-center">
          <svg class="h-5 w-5 text-green-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class:font-bold={i === 0 && (tier.name === 'Enhanced' || tier.name === 'Premium')}>{feature}</span>
        </li>
      {/each}
    </ul>
  </div>
  <div class="p-6 bg-gray-50 rounded-b-lg mt-auto">
    <a href={tier.href} class="btn btn-primary w-full">Choose Plan</a>
  </div>
</div> 