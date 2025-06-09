<script lang="ts">
    export let error: string | null = null;
</script>

{#if error}
    <div class="bg-red-50 border border-red-200 text-sm text-red-800 rounded-md p-4" role="alert">
        <span class="font-bold">Error:</span> {error}
    </div>
{/if} 