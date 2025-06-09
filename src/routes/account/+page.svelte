<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
    <div class="max-w-xl mx-auto">
        <div class="text-center mb-10">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Account</h1>
            <p class="text-gray-600">View and manage your account details.</p>
        </div>

        <div class="bg-white shadow-lg rounded-lg p-8">
            <div class="space-y-4">
                <div>
                    <h2 class="text-sm font-medium text-gray-500">Name</h2>
                    <p class="mt-1 text-lg text-gray-900">{data.user?.name || 'N/A'}</p>
                </div>
                <div class="border-t border-gray-200"></div>
                <div>
                    <h2 class="text-sm font-medium text-gray-500">Email</h2>
                    <p class="mt-1 text-lg text-gray-900">{data.user?.email || 'N/A'}</p>
                </div>
                <div class="border-t border-gray-200"></div>
                <div>
                    <h2 class="text-sm font-medium text-gray-500">Subscription Status</h2>
                    <p class="mt-1 text-lg text-green-600 font-semibold">Active</p>
                </div>
            </div>
        </div>
    </div>
</div> 