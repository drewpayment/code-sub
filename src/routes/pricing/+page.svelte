<script lang="ts">
  import { Container, Grid } from '$lib';
  import PricingCard from '$lib/components/PricingCard.svelte';
  import Faq from '$lib/components/Faq.svelte';

  const pricingTiers = [
    {
      name: 'Essential',
      description: 'Core features for a professional online presence.',
      price: '49',
      features: ['Up to 5 pages', 'Responsive Design', 'Basic SEO Setup'],
      href: '/contact?plan=essential',
    },
    {
      name: 'Enhanced',
      description: 'Advanced features for growing businesses.',
      price: '99',
      features: ['Everything in Essential, plus:', 'Up to 15 pages', 'CMS Integration', 'Advanced Analytics'],
      href: '/contact?plan=enhanced',
      popular: true,
    },
    {
      name: 'Premium',
      description: 'Complete solutions for large-scale projects.',
      price: '199',
      features: ['Everything in Enhanced, plus:', 'E-commerce Functionality', 'Priority Support', 'Monthly Performance Reports'],
      href: '/contact?plan=premium',
    },
  ];

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
  ]
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
        {#each pricingTiers as tier}
          <PricingCard {tier} />
        {/each}
      </Grid>
    </div>

    <div class="mt-24">
      <h2 class="text-3xl font-bold text-center text-gray-900">Feature Comparison</h2>
      <div class="mt-8 max-w-4xl mx-auto">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr>
                <th class="py-4 pr-6 font-semibold text-lg">Feature</th>
                <th class="w-1/4 py-4 px-6 font-semibold text-lg text-center">Essential</th>
                <th class="w-1/4 py-4 px-6 font-semibold text-lg text-center">Enhanced</th>
                <th class="w-1/4 py-4 px-6 font-semibold text-lg text-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-200">
                <td class="py-4 pr-6">Number of Pages</td>
                <td class="py-4 px-6 text-center">Up to 5</td>
                <td class="py-4 px-6 text-center">Up to 15</td>
                <td class="py-4 px-6 text-center">Unlimited</td>
              </tr>
              <tr class="border-t border-gray-200">
                <td class="py-4 pr-6">CMS Integration</td>
                <td class="py-4 px-6 text-center text-gray-400">&mdash;</td>
                <td class="py-4 px-6 text-center text-green-500">✓</td>
                <td class="py-4 px-6 text-center text-green-500">✓</td>
              </tr>
              <tr class="border-t border-gray-200">
                <td class="py-4 pr-6">Advanced Analytics</td>
                <td class="py-4 px-6 text-center text-gray-400">&mdash;</td>
                <td class="py-4 px-6 text-center text-green-500">✓</td>
                <td class="py-4 px-6 text-center text-green-500">✓</td>
              </tr>
              <tr class="border-t border-gray-200">
                <td class="py-4 pr-6">E-commerce</td>
                <td class="py-4 px-6 text-center text-gray-400">&mdash;</td>
                <td class="py-4 px-6 text-center text-gray-400">&mdash;</td>
                <td class="py-4 px-6 text-center text-green-500">✓</td>
              </tr>
               <tr class="border-t border-gray-200">
                <td class="py-4 pr-6">Priority Support</td>
                <td class="py-4 px-6 text-center text-gray-400">&mdash;</td>
                <td class="py-4 px-6 text-center text-gray-400">&mdash;</td>
                <td class="py-4 px-6 text-center text-green-500">✓</td>
              </tr>
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