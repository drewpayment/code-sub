<script lang="ts">
  import { Minus, Plus } from 'lucide-svelte';

  type FaqItem = {
    question: string;
    answer: string;
  };

  let { item }: { item: FaqItem } = $props();
  let isOpen = $state(false);
</script>

<div class="border-b border-gray-200 py-6">
  <button onclick={() => isOpen = !isOpen} class="w-full flex justify-between items-center text-left">
    <span class="text-lg font-medium text-gray-900">{item.question}</span>
    {#if isOpen}
      <Minus class="h-6 w-6 text-gray-400" />
    {:else}
      <Plus class="h-6 w-6 text-gray-400" />
    {/if}
  </button>
  {#if isOpen}
    <div class="mt-4 pr-12">
      <p class="text-base text-gray-600">{item.answer}</p>
    </div>
  {/if}
</div> 