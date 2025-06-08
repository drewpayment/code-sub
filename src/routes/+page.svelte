<script lang="ts">
  import { Container, Grid } from '$lib';
  import PricingCard from '$lib/components/PricingCard.svelte';

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
</script>

<!-- Hero Section -->
<div class="relative overflow-hidden">
  <!-- Background Image -->
  <!-- <picture>
    <source media="(min-width: 1024px)" srcset="/images/hero/hero-main-1920x1080.webp" />
    <source media="(min-width: 768px)" srcset="/images/hero/hero-main-1024x600.webp" />
    <img 
      src="/images/hero/hero-main-768x500.webp" 
      alt="Professional web development team collaborating on a business website"
      class="absolute inset-0 w-full h-full object-cover z-10"
      loading="eager"
    />
  </picture> -->
  <div class="absolute inset-0 bg-gray-900 bg-opacity-60 z-20"></div>

  <div class="relative z-30 py-16 lg:py-24 -mx-4 sm:-mx-6 lg:-mx-8">
    <Container size="xl" padding="lg">
      <div class="text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
          Professional <span class="text-gradient-primary">Web Development</span>
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
          We partner with businesses to create professional websites that drive results and growth. 
          Build your online presence with our expert development team.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <a href="/contact" class="btn btn-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium min-h-[48px] flex items-center justify-center">
            Get Started Today
          </a>
          <a href="/services" class="btn w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border border-white text-white bg-transparent hover:bg-white hover:text-gray-900 min-h-[48px] flex items-center justify-center">
            View Services
          </a>
        </div>
      </div>
    </Container>
  </div>
</div>

<!-- Services Section -->
<div class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
  <Container size="xl" padding="lg">
    <div class="text-center mb-12 sm:mb-16">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Flexible Pricing Plans</h2>
      <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Choose a plan that fits your needs and budget, from essential features to premium services.
      </p>
    </div>
    
    <Grid cols={{ sm: 1, lg: 3 }} gap="lg" class="items-stretch">
      {#each pricingTiers as tier}
        <PricingCard {tier} />
      {/each}
    </Grid>
  </Container>
</div>

<!-- CTA Section -->
<div class="bg-blue-600 py-12 sm:py-16 -mx-4 sm:-mx-6 lg:-mx-8">
  <Container size="xl" padding="lg">
    <div class="text-center">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
        Ready to Get Started?
      </h2>
      <p class="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
        Let's discuss your project and build something amazing together.
      </p>
      <a href="/contact" class="btn bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium min-h-[48px] flex items-center justify-center max-w-xs mx-auto sm:max-w-none">
        Contact Us Today
      </a>
    </div>
  </Container>
</div>