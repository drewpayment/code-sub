<script lang="ts">
    import type { PageData } from './$types';
    import type { SubscriptionStatus } from '$lib/types/subscription';

    export let data: PageData;

    // Helper function to get status color and text
    function getStatusDisplay(status: SubscriptionStatus) {
        switch (status) {
            case 'active':
                return {
                    text: 'Active',
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                    borderColor: 'border-green-200'
                };
            case 'pending':
                return {
                    text: 'Pending Setup',
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-100',
                    borderColor: 'border-yellow-200'
                };
            case 'cancelled':
                return {
                    text: 'Cancelled',
                    color: 'text-red-600',
                    bgColor: 'bg-red-100',
                    borderColor: 'border-red-200'
                };
            case 'suspended':
                return {
                    text: 'Suspended',
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-100',
                    borderColor: 'border-orange-200'
                };
            default:
                return {
                    text: 'Unknown',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    borderColor: 'border-gray-200'
                };
        }
    }

    $: statusDisplay = data.subscription ? getStatusDisplay(data.subscription.status) : null;
    $: plan = data.subscription?.expand?.plan_id;
</script>

<div class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
    <div class="max-w-xl mx-auto">
        <div class="text-center mb-10">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Account</h1>
            <p class="text-gray-600">View and manage your account details.</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-8">
            <div class="space-y-6">
                <!-- User Information -->
                <div>
                    <h2 class="text-sm font-medium text-gray-500">Name</h2>
                    <p class="mt-1 text-lg text-gray-900">{data.user?.name || 'N/A'}</p>
                </div>
                <div class="border-t border-gray-200"></div>
                <div>
                    <h2 class="text-sm font-medium text-gray-500">Email</h2>
                    <p class="mt-1 text-lg text-gray-900">{data.user?.email || 'N/A'}</p>
                </div>
                
                <!-- Subscription Information -->
                <div class="border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Subscription Details</h3>
                    
                    {#if data.subscription && plan}
                        <div class="space-y-4">
                            <!-- Plan Information -->
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">Current Plan</h4>
                                <div class="mt-1 flex items-center justify-between">
                                    <div>
                                        <p class="text-lg font-semibold text-gray-900">{plan.name}</p>
                                        <p class="text-sm text-gray-600">{plan.description || ''}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-lg font-bold text-gray-900">${plan.price}</p>
                                        <p class="text-sm text-gray-500 capitalize">/{plan.billing_period}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Status -->
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">Status</h4>
                                <div class="mt-2">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {statusDisplay?.color} {statusDisplay?.bgColor} border {statusDisplay?.borderColor}">
                                        {statusDisplay?.text}
                                    </span>
                                </div>
                            </div>

                            <!-- Additional Information -->
                            {#if data.subscription.start_date}
                                <div>
                                    <h4 class="text-sm font-medium text-gray-500">Start Date</h4>
                                    <p class="mt-1 text-sm text-gray-900">
                                        {new Date(data.subscription.start_date).toLocaleDateString()}
                                    </p>
                                </div>
                            {/if}

                            {#if data.subscription.notes}
                                <div>
                                    <h4 class="text-sm font-medium text-gray-500">Notes</h4>
                                    <p class="mt-1 text-sm text-gray-600">{data.subscription.notes}</p>
                                </div>
                            {/if}

                            <!-- Action Buttons -->
                            <div class="flex space-x-3 pt-4">
                                {#if data.subscription.status === 'pending'}
                                    <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Complete Setup
                                    </button>
                                {/if}
                                <a href="/account/subscription" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Manage Subscription
                                </a>
                            </div>
                        </div>
                    {:else}
                        <!-- No Subscription -->
                        <div class="text-center py-8">
                            <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h4 class="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h4>
                            <p class="text-gray-600 mb-4">Get started with one of our subscription plans.</p>
                            <a href="/account/subscription" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Choose a Plan
                            </a>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div> 