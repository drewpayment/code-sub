# 🔨 PROJECT TASK LIST

**Current Phase:** VAN Mode (Awaiting next task)

## Next Task: TBD
- [ ] Define the next high-level feature or bug fix.
- [ ] Use the VAN (Verify, Analyze, Navigate) mode to plan the task.
- [ ] Populate this document with the new task breakdown.

# Task Plan: Stripe Integration

- **Complexity:** Level 4
- **PRD:** [prd-stripe-integration.md](mdc:tasks/prd-stripe-integration.md)
- **Priority:** High

---

## 1. Architectural Overview

This feature will integrate Stripe Billing to automate the entire subscription payment lifecycle. The architecture will add new components for handling payments and webhooks while extending the existing `SubscriptionService` and database schema.

**Data Flow:**
1.  **Customer Action:** A customer with a `pending_payment_setup` subscription initiates the payment flow from their account page.
2.  **Stripe Checkout:** The application will generate a Stripe Checkout session. The customer securely enters their payment details directly into Stripe's embedded form.
3.  **Stripe Webhooks:** Stripe will send webhook events to a dedicated endpoint in our application to notify us of successful payments, failures, and other subscription status changes.
4.  **Database Updates:** The webhook handler will update the subscription status in our local PocketBase database (e.g., to `active` or `overdue`). It will also store the Stripe Customer ID and Subscription ID.
5.  **Admin & Customer Views:** The admin dashboard and customer account pages will query our local database for the subscription status and call the Stripe API directly to fetch and display billing history.

**Key Architectural Decisions:**
-   **Leverage Stripe Billing:** We will use Stripe's robust subscription management system instead of building our own. This includes using Stripe for invoicing, dunning (payment retries), and automated email notifications.
-   **Webhook-Driven Synchronization:** The primary mechanism for keeping our system's subscription status up-to-date will be through Stripe webhooks. This creates a reliable, event-driven architecture.
-   **Direct API for History:** To keep our local database lean, payment history will be fetched on-demand from the Stripe API rather than storing every transaction locally.

---

## 2. Components, Routes, and Files to Create/Modify

### **Phase 1: Foundation (Data & Types)** ✅ COMPLETE
-   **File:** `pb_schema.json`
    -   **Change:** Modify the `subscriptions` collection to add a new `overdue` status option.
    -   **Change:** Add `stripe_customer_id` and `stripe_subscription_id` text fields to the `subscriptions` collection to store Stripe identifiers.
-   **File:** `src/lib/types/subscription.ts`
    -   **Change:** Update the `SubscriptionStatus` enum to include the new `overdue` status.
    -   **Change:** Add the new Stripe ID fields to the `Subscription` interface.

### **Phase 2: Backend Logic** ✅ COMPLETE
-   **File:** `src/lib/server/stripe.ts` (New File)
    -   **Responsibility:** Initialize the Stripe Node.js client with the secret key. This module will contain all server-side functions that interact with the Stripe API (e.g., creating Checkout sessions, listing invoices).
-   **File:** `.env` / `.env.example`
    -   **Change:** Add `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.
-   **File:** `src/routes/api/webhooks/stripe/+server.ts` (New File)
    -   **Responsibility:** The dedicated endpoint to receive and process webhook events from Stripe. It will verify webhook signatures and update our database accordingly.
-   **File:** `src/routes/account/subscription/+page.server.ts`
    -   **Change:** Add a new form action (`createCheckoutSession`) that generates a Stripe Checkout session and redirects the user to it.

### **Phase 3: Customer-Facing Implementation** ✅ COMPLETE
-   [x] **Task 3.1:** In `src/routes/account/subscription/+page.svelte`, add the button and form to trigger the `createCheckoutSession` action for pending subscriptions.
-   [x] **Task 3.2:** Create the "Billing History" component. It should make a `fetch` call to a new server endpoint that, in turn, calls the Stripe API to list charges/invoices for the customer.
-   [x] **Task 3.3:** Add logic to display the `overdue` status prominently, including the warning banner and link to the Stripe customer portal for payment updates.

**Status:** Customer-facing UI complete. Payment setup, billing history, and overdue payment handling implemented.

### **Phase 4: Admin-Facing Implementation** - MOSTLY COMPLETE
-   **File:** `/src/routes/admin/customers/[id]/billing/+page.server.ts` (New File)
    -   **Responsibility:** Fetches the complete billing history for a specific customer from the Stripe API.
-   **File:** `/src/routes/admin/customers/[id]/billing/+page.svelte` (New File)
    -   **Responsibility:** Renders the customer's billing history table, including links to Stripe invoices.
-   **File:** `/src/routes/admin/+page.server.ts`
    -   **Change:** Update the `load` function to fetch subscription metrics (e.g., counts of `overdue` and `canceled` accounts) from Stripe.
-   **File:** `/src/routes/admin/+page.svelte`
    -   **Change:** Add new dashboard widgets to display the Stripe-related metrics.

---

## 3. Implementation Plan & Checklist

### **Phase 1: Foundation (Data & Types)** ✅ COMPLETE
-   [x] **Task 1.1:** Update `pb_schema.json`:
    -   [x] Add `overdue` to the list of allowed `status` values in the `subscriptions` collection.
    -   [x] Add `stripe_customer_id` (text) to the `users` collection.
    -   [x] Add `stripe_subscription_id` (text) to the `subscriptions` collection.
-   [x] **Task 1.2:** Update `src/lib/types/subscription.ts`:
    -   [x] Add `'overdue'` to the `SubscriptionStatus` type definition.
    -   [x] Add `stripe_customer_id: string;` to the `User` interface.
    -   [x] Add `stripe_subscription_id: string;` to the `Subscription` interface.
-   [x] **Task 1.3:** Add Stripe keys to environment variables and update the example file.
    -   [x] Documented required environment variables (STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)

**Status:** Phase 1 complete. Database schema and TypeScript types updated for Stripe integration.

### **Phase 2: Backend Logic** ✅ COMPLETE
-   [x] **Task 2.1:** Create `src/lib/server/stripe.ts` and initialize the Stripe client.
-   [x] **Task 2.2:** Implement a function in `stripe.ts` to create a Stripe `Customer` if one doesn't exist for a user.
-   [x] **Task 2.3:** Implement the `createCheckoutSession` function in `stripe.ts` that creates and returns a Stripe Checkout session URL.
-   [x] **Task 2.4:** Implement the corresponding form action in `src/routes/account/subscription/+page.server.ts` that calls `createCheckoutSession`.
-   [x] **Task 2.5:** Create the Stripe webhook endpoint at `src/routes/api/webhooks/stripe/+server.ts`.
    -   [x] Implement signature verification to secure the endpoint.
    -   [x] Handle the `checkout.session.completed` event to store Stripe IDs and set subscription status to `active`.
    -   [x] Handle `invoice.payment_failed` to set status to `overdue`.
    -   [x] Handle `invoice.paid` and `customer.subscription.updated` to ensure status stays `active`.

**Status:** Backend Stripe integration complete. All server-side components implemented.

### **Phase 4: Admin-Facing Implementation**
-   [ ] **Task 4.1:** Create the `/admin/customers/[id]/billing` page and its server-side `load` function to fetch and pass the full billing history from Stripe.
-   [ ] **Task 4.2:** Build the Svelte component to render the billing history table.
-   [ ] **Task 4.3:** Update the admin dashboard's `load` function to fetch the new metrics from Stripe.
-   [ ] **Task 4.4:** Create the new Svelte components for the admin dashboard to display these metrics.

### **Phase 5: Testing and Verification**
-   [ ] **Task 5.1:** Use the Stripe CLI to test the webhook endpoint locally.
-   [ ] **Task 5.2:** Manually test the full payment flow with Stripe's test card numbers.
-   [ ] **Task 5.3:** Manually test the failed payment flow by using Stripe's specific test cards for failures.
-   [ ] **Task 5.4:** Verify that all data is displayed correctly on both the customer and admin pages.
-   [ ] **Task 5.5:** Configure the automated emails within the Stripe Dashboard.

## Build Status Summary

### ✅ COMPLETED PHASES:

**Phase 1: Foundation (Data & Types)** ✅ COMPLETE
- Database schema updated with `overdue` status and Stripe customer IDs
- TypeScript types updated for new subscription status and user fields
- Environment variable documentation created

**Phase 2: Backend Logic** ✅ COMPLETE  
- Stripe client initialization and service functions implemented
- Webhook endpoint created with signature verification
- Payment flow actions integrated into subscription page server
- All major webhook events handled (checkout completion, payment success/failure, subscription updates)

**Phase 3: Customer-Facing Implementation** ✅ COMPLETE
- Payment setup buttons added for pending subscriptions
- Overdue payment warnings and recovery flow implemented
- Billing history display with 12-month rolling window
- Complete Stripe checkout integration

**Phase 4: Admin-Facing Implementation** - MOSTLY COMPLETE
- [x] Admin customer billing page server component created
- [x] Admin billing history display component created (with minor linting issues)
- [ ] Admin dashboard metrics integration (remaining task)

### 🔄 REMAINING WORK:

**Phase 4 Completion:**
-   [ ] **Task 4.3:** Update the admin dashboard's `load` function to fetch the new metrics from Stripe.
-   [ ] **Task 4.4:** Create the new Svelte components for the admin dashboard to display these metrics.

**Phase 5: Testing and Verification**
-   [ ] **Task 5.1:** Use the Stripe CLI to test the webhook endpoint locally.
-   [ ] **Task 5.2:** Manually test the full payment flow with Stripe's test card numbers.
-   [ ] **Task 5.3:** Manually test the failed payment flow by using Stripe's specific test cards for failures.
-   [ ] **Task 5.4:** Verify that all data is displayed correctly on both the customer and admin pages.
-   [ ] **Task 5.5:** Configure the automated emails within the Stripe Dashboard.

**Status:** Major Stripe integration components implemented. Core payment flow, webhooks, and customer/admin interfaces functional. Minor dashboard metrics and testing remain.
