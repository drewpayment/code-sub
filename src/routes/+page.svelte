<script lang="ts">
  import { Container, Grid } from '$lib';
</script>

<!-- Hero Section -->
<div class="relative overflow-hidden">
  <!-- Background Image -->
  <picture>
    <source media="(min-width: 1024px)" srcset="/images/hero/hero-main-1920x1080.webp" />
    <source media="(min-width: 768px)" srcset="/images/hero/hero-main-1024x600.webp" />
    <img 
      src="/images/hero/hero-main-768x500.webp" 
      alt="Professional web development team collaborating on a business website"
      class="absolute inset-0 w-full h-full object-cover z-10"
      loading="eager"
    />
  </picture>
  <!-- Overlay -->
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
          <a href="/services" class="btn w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 min-h-[48px] flex items-center justify-center">
            View Services
          </a>
        </div>
      </div>
    </Container>
  </div>
</div>

<!-- Services Section -->
<div class="py-12 sm:py-16 lg:py-24">
  <Container size="xl" padding="lg">
    <div class="text-center mb-12 sm:mb-16">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Services</h2>
      <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Comprehensive web development solutions tailored to your business needs.
      </p>
    </div>
    
    <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
      <div class="card">
        <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">Custom Development</h3>
        <p class="text-gray-600">Tailored web applications built with modern technologies and best practices.</p>
      </div>
      
      <div class="card">
        <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">Responsive Design</h3>
        <p class="text-gray-600">Mobile-first designs that look perfect on all devices and screen sizes.</p>
      </div>
      
      <div class="card">
        <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">Performance Optimization</h3>
        <p class="text-gray-600">Lightning-fast websites optimized for speed, SEO, and user experience.</p>
      </div>
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