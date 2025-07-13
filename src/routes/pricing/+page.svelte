<script lang="ts">
  import { Container, Grid } from '$lib';
  import PricingCard from '$lib/components/PricingCard.svelte';
  import OneTimeProjectCard from '$lib/components/OneTimeProjectCard.svelte';
  import Faq from '$lib/components/Faq.svelte';

  export let data: any;

  type TierKey = 'essential' | 'professional' | 'premium';

  // Fallback pricing tiers (if no data from server)
  const fallbackPricingTiers = [
    {
      name: 'Essential Care',
      description: 'Reliable hosting and core maintenance for a secure online presence.',
      price: '49',
      features: [
        'Website hosting & uptime monitoring',
        'SSL certificate management',
        'Regular security updates',
        'Monthly backups',
        'Basic tech stack updates',
        'Email support'
      ],
      href: '/contact?source=pricing&plan=essential-care'
    },
    {
      name: 'Professional Care',
      description: 'Proactive support and optimization for growing businesses.',
      price: '99',
      features: [
        'Everything in Essential Care',
        'Content updates (2 hours/month)',
        'Performance monitoring & optimization',
        'Basic SEO health checks',
        'Google Analytics setup',
        'Priority email support'
      ],
      href: '/contact?source=pricing&plan=professional-care',
      popular: true
    },
    {
      name: 'Premium Care',
      description: 'Comprehensive support and strategic insights for established businesses.',
      price: '199',
      features: [
        'Everything in Professional Care',
        'Extended content updates (4 hours/month)',
        'Monthly performance reports',
        'Advanced SEO optimization',
        'Emergency response (4hr)',
        'Phone support'
      ],
      href: '/contact?source=pricing&plan=premium-care'
    }
  ];

  // Use server data if available, otherwise fallback to static data
  $: subscriptionPlans = data.subscriptionPlans?.length > 0 ? data.subscriptionPlans : fallbackPricingTiers;
  $: oneTimeProjects = data.oneTimeProjects || [];

  const faqItems = [
    {
      question: 'What is included in the price?',
      answer: 'All our plans include hosting, maintenance, and support. We handle the technical side so you can focus on your business.'
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Absolutely. You can upgrade or downgrade your plan at any time to match your business needs.'
    },
    {
      question: 'What if I need more than the Premium plan offers?',
      answer: 'We offer custom solutions for large-scale projects with unique requirements. Contact us to discuss your needs.'
    }
  ];

  const comparisonFeatures: {
    name: string;
    tiers: Record<TierKey, boolean | string>;
  }[] = [
    {
      name: 'Hosting & Uptime Monitoring',
      tiers: { essential: true, professional: true, premium: true }
    },
    { name: 'Security & Backups', tiers: { essential: true, professional: true, premium: true } },
    {
      name: 'Content Updates',
      tiers: { essential: '—', professional: '2 hrs/mo', premium: '4 hrs/mo' }
    },
    {
      name: 'Performance Optimization',
      tiers: { essential: false, professional: true, premium: true }
    },
    { name: 'Basic SEO Checks', tiers: { essential: false, professional: true, premium: true } },
    { name: 'Advanced SEO', tiers: { essential: false, professional: true, premium: true } },
    {
      name: 'Monthly Performance Reports',
      tiers: { essential: false, professional: false, premium: true }
    },
    { name: 'Priority Support', tiers: { essential: false, professional: true, premium: true } },
    { name: 'Phone Support', tiers: { essential: false, professional: false, premium: true } }
  ];
</script>

<div class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
  <Container>
    <div class="text-center">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
        Flexible Pricing for Your Business
      </h1>
      <p class="mt-4 text-lg text-gray-600">
        Choose a plan that fits your needs and budget.
      </p>
    </div>

    <div class="mt-16">
      <Grid cols={{ sm: 1, lg: 3 }} gap="lg" class="items-stretch">
        {#each subscriptionPlans as tier}
          <PricingCard {tier} />
        {/each}
      </Grid>
    </div>

    <!-- One-Time Projects Section -->
    {#if oneTimeProjects.length > 0}
      <div class="mt-24">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
            One-Time Projects
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            Custom solutions for specific business needs. Get a personalized quote.
          </p>
        </div>
        
        <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg" class="items-stretch">
          {#each oneTimeProjects as project}
            <OneTimeProjectCard plan={project} />
          {/each}
        </Grid>
      </div>
    {/if}

    <div class="mt-24">
      <h2 class="text-3xl font-bold text-center text-gray-900">Feature Comparison</h2>
      <div class="mt-8 max-w-4xl mx-auto">
        <div class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="w-full text-left border-collapse bg-white">
            <thead>
              <tr>
                <th class="py-4 px-6 font-semibold text-lg">Feature</th>
                <th class="w-1/4 py-4 px-6 font-semibold text-lg text-center">Essential</th>
                <th class="w-1/4 py-4 px-6 font-semibold text-lg text-center">Professional</th>
                <th class="w-1/4 py-4 px-6 font-semibold text-lg text-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              {#each comparisonFeatures as feature}
                <tr class="border-t border-gray-200">
                  <td class="py-4 px-6">{feature.name}</td>
                  {#each ['essential', 'professional', 'premium'] as tierKey}
                    <td class="py-4 px-6 text-center">
                      {#if typeof feature.tiers[tierKey as TierKey] === 'boolean'}
                        {#if feature.tiers[tierKey as TierKey]}
                          <span class="text-green-500 text-xl">✓</span>
                        {:else}
                          <span class="text-gray-400 text-xl">&mdash;</span>
                        {/if}
                      {:else}
                        {feature.tiers[tierKey as TierKey]}
                      {/if}
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="mt-24 max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold text-center text-gray-900">Frequently Asked Questions</h2>
      <div class="mt-8">
        {#each faqItems as item}
          <Faq {item} />
        {/each}
      </div>
    </div>
  </Container>
</div> 