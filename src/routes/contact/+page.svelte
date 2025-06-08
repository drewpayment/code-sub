<script lang="ts">
  import { Container } from '$lib';
  import { Building, Mail, Phone } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Contact Us - Code-Sub</title>
  <meta name="description" content="Contact Code-Sub for professional web development services." />
</svelte:head>

<div class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
  <Container>
    <div class="text-center">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
        Get in Touch
      </h1>
      <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        We're here to help. Whether you have a question about our services or want to discuss your project, we'd love to hear from you.
      </p>
    </div>

    <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
      <!-- Contact Form -->
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
        <form class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" autocomplete="name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" autocomplete="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
            <textarea id="message" name="message" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>
          <div>
            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Submit
            </button>
          </div>
        </form>
      </div>

      <!-- Contact Info -->
      <div class="space-y-8">
        <h2 class="text-2xl font-bold text-gray-900">Contact Information</h2>
        <div class="flex items-start">
          <Building class="h-6 w-6 text-blue-600 mt-1" />
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Our Office</h3>
            <p class="text-gray-600">123 Web Dev Lane, Suite 100<br>San Francisco, CA 94105</p>
          </div>
        </div>
        <div class="flex items-start">
          <Mail class="h-6 w-6 text-blue-600 mt-1" />
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Email</h3>
            <a href="mailto:contact@codesub.com" class="text-blue-600 hover:underline">contact@codesub.com</a>
          </div>
        </div>
        <div class="flex items-start">
          <Phone class="h-6 w-6 text-blue-600 mt-1" />
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Phone</h3>
            <a href="tel:+1234567890" class="text-blue-600 hover:underline">(123) 456-7890</a>
          </div>
        </div>
      </div>
    </div>
  </Container>
</div> 