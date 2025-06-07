<script lang="ts">
  import { Container, Grid } from '$lib';
</script>

<Container size="xl" padding="lg">
  <!-- Hero Section -->
  <div class="py-16">
    <h1 class="text-6xl font-extrabold text-blue-600 mb-6">
      Professional Web Development
    </h1>

    <!-- Section Heading -->
    <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>

    <!-- Body Text -->
    <p class="text-lg text-gray-600 mb-8 max-w-2xl">
      We partner with businesses to create professional websites that drive results and growth.
    </p>

    <!-- Primary CTA -->
    <button class="btn btn-primary px-8 py-4 text-lg font-medium mb-12 rounded-lg">
      Get Started Today
    </button>
  </div>

  <!-- Simple Grid Test with hardcoded classes -->
  <div class="py-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-8">Hardcoded Grid Test</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each Array(8) as _, i}
        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-3">Service {i + 1}</h3>
          <p class="text-gray-600">This demonstrates our responsive grid system working with different screen sizes.</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- Grid Component Test -->
  <div class="py-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-8">Grid Component Test</h2>
    
    <Grid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap="lg">
      {#each Array(4) as _, i}
        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-3">Component {i + 1}</h3>
          <p class="text-gray-600">Testing the Grid component functionality.</p>
        </div>
      {/each}
    </Grid>
  </div>

  <!-- Test our custom classes -->
  <div class="mt-8 p-4 bg-gray-100 rounded-lg">
    <h4 class="text-xl font-semibold mb-2">Testing Custom Classes:</h4>
    <p class="text-2xl font-bold text-gradient-primary">Gradient Text Effect</p>
  </div>
</Container>