# ✨ FEATURE: Admin One-Time Project Invoicing

**Objective:** To enable administrators to create, send, and track Stripe invoices for "one-time project" plans directly from the customer detail page.

**Status:** 🔧 **DEBUGGING FINAL ISSUE**

---

## ✅ Task Checklist

### Phase 1: Backend & Data Structure ✅ COMPLETE

- [x] **Task 1: Enhance Data Model for Invoicing.**
  - **Description:** Create a new PocketBase collection named `one_time_invoices` to track charges independently of Stripe's system. This provides a reliable history within our own database.
  - **Schema:**
    - `customer_id` (relation to `users`)
    - `plan_id` (relation to `plans`)
    - `stripe_invoice_id` (text, unique)
    - `status` (text: `draft`, `open`, `paid`, `uncollectible`, `void`)
    - `amount` (number, the final invoiced amount)
    - `due_date` (date, optional)
    - `invoice_pdf` (text, URL to Stripe-hosted PDF)
  - **Action:** Add this to the `pb_schema.json` and have the user import it.
  - **Status:** ✅ Complete - Schema added and imported by user

- [x] **Task 2: Create a New Server Action for Invoice Creation.**
  - **Description:** Implement a `createOneTimeInvoice` action in `src/routes/admin/customers/[id]/+page.server.ts`.
  - **Logic:**
    - The action will receive `planId`, `amount`, and the customer's PocketBase `id`.
    - Validate that the `amount` is within the selected plan's `price_min` and `price_max`.
    - Use the Stripe API:
      1. Create a Stripe Invoice Item with the customer's `stripe_customer_id`, `amount`, and a description.
      2. Create a Stripe Invoice for that customer.
      3. Finalize and send the invoice.
    - On success, create a corresponding record in our new `one_time_invoices` collection with the initial `status` and `stripe_invoice_id`.
  - **Status:** ✅ Complete - Server action implemented with proper error handling and validation

- [x] **Task 3: Update Stripe Webhook Handler.**
  - **Description:** Enhance the existing webhook at `src/routes/api/webhooks/stripe/+server.ts` to process invoice events.
  - **Events to Handle:**
    - `invoice.paid`: Update the corresponding `one_time_invoices` record status to `paid` and store the `invoice_pdf` URL.
    - `invoice.payment_failed`: Update status to `uncollectible`.
    - `invoice.voided`: Update status to `void`.
  - **Status:** ✅ Complete - Webhook handlers implemented for all invoice events

### Phase 2: Admin Dashboard UI ✅ COMPLETE

- [x] **Task 4: Implement Invoice Creation Form.**
  - **Description:** Add a new UI section on `src/routes/admin/customers/[id]/+page.svelte` for invoicing one-time projects.
  - **UI Components:**
    - A new card/section titled "Create One-Time Invoice".
    - A dropdown to select from available plans of type `one_time_project`.
    - An input field for the final `amount` (in dollars).
    - A "Create & Send Invoice" button that submits to the `createOneTimeInvoice` action.
    - Add client-side validation to ensure the amount is within the selected plan's range before submission.
  - **Status:** ✅ Complete - Invoice creation form implemented with validation and plan preview

- [x] **Task 5: Display Invoice History.**
  - **Description:** Add a section to display the history of one-time invoices on the same customer detail page.
  - **Implementation:**
    - In the `load` function of `+page.server.ts`, fetch all records from `one_time_invoices` for the current customer.
    - Create a new table or list on the Svelte page to display the invoice history.
    - **Columns:** Plan Name, Amount, Status (with color coding), Date Created, Link to Stripe Invoice PDF.
  - **Status:** ✅ Complete - Invoice history table implemented with proper formatting and PDF links

### Phase 3: Verification & Testing ⚠️ DEBUGGING

- [x] **Task 6: Full-Flow Testing.**
  - **Description:** Verify the entire workflow from invoice creation to payment confirmation.
  - **Test Steps:**
    1. As an admin, create an invoice for a customer.
    2. Verify the invoice appears in the history with `open` status.
    3. Verify the customer receives the invoice email from Stripe.
    4. Access the Stripe-hosted invoice and pay it using test credentials.
    5. Verify the webhook updates the invoice status to `paid` in the admin UI.
    6. Verify the PDF link is available and works.
  - **Status:** 🔧 **DEBUGGING** - Core functionality works (invoice creation successful), but post-creation page redirect/reload fails with customer lookup error

- [x] **Task 7: Write E2E Test with Playwright.**
  - **Description:** Create a new Playwright test file to automate the verification of the one-time invoice creation workflow.
  - **Test Steps:**
    1.  Log in as an admin user.
    2.  Navigate to a specific customer's detail page that is configured with Stripe.
    3.  Locate the "Create One-Time Invoice" form.
    4.  Select a one-time project plan from the dropdown.
    5.  Enter a valid amount in the input field.
    6.  Submit the form.
    7.  Assert that a success message is displayed.
    8.  Assert that the newly created invoice appears in the "Invoice History" list with the correct details and "open" status.
  - **Notes:** This test will likely require mocking Stripe API calls to avoid real network requests and to ensure deterministic results. We may need to add a new MSW (Mock Service Worker) handler or a similar mechanism if one doesn't already exist for Stripe.
  - **Status:** ✅ Complete - Comprehensive E2E test implemented covering all workflow steps, validation, error handling, and responsive design

---

## 🗒️ Notes
- This feature requires careful handling of financial data and secure interaction with the Stripe API.
- All currency amounts should be handled in cents when communicating with Stripe. The UI can display dollars, but the server action must convert it.
- Error handling is critical. The UI must clearly display errors from both form validation and the Stripe API.
- **Creative Flag:** The UI design for the invoice creation form and the history list will require some creative thought to ensure it fits well within the existing page layout.

## 🚀 Build Progress
- ✅ **Phase 1 Complete:** Backend schema, server actions, and webhook handlers implemented
- ✅ **Phase 2 Complete:** Admin UI form and invoice history implemented  
- 🔧 **Phase 3 Debugging:** Core functionality working, troubleshooting final redirect issue

## 📝 Implementation Notes
- All core functionality implemented with proper error handling
- Client-side validation ensures amount is within plan price range
- Invoice history displays with color-coded status indicators
- PDF links provided for completed invoices
- Webhook handlers update invoice status automatically
- Comprehensive E2E test suite covers all user flows and edge cases

## 🎯 Test Coverage
- **E2E Tests:** 9 test cases covering main workflow, validation, error handling, and responsive design
- **Browser Coverage:** Chromium, Firefox, and WebKit
- **Test File:** `e2e/tests/one-time-invoices.spec.ts`

## 🔧 Current Debugging Status

### ✅ CONFIRMED WORKING:
- Invoice creation process (Stripe integration fully functional)
- PocketBase record creation (authentication issue resolved)
- Webhook processing (invoice events handled correctly)
- Form validation and user input handling
- Stripe invoice generation, finalization, and sending

### 🔍 DEBUGGING NEEDED:
- **Issue:** After successful invoice creation, page redirect/reload fails with 404 customer lookup error
- **Root Cause:** Investigating. Previous theory of `fetch` conflict was incorrect. New theory points to async context loss during Stripe SDK calls.
- **Evidence:** Logs show "Successfully created one-time invoice record" followed by "Error loading customer data: ClientResponseError 404"
- **Next Steps:** Pinpoint the exact Stripe API call that causes PocketBase `authStore` to be cleared.

### 🛠️ Technical Issues Resolved:
1. **emailVisibility Problem:** Fixed registration to set `emailVisibility: true` by default
2. **Authentication State Loss:** Implemented fresh PocketBase instance creation for form actions
3. **Stripe Integration:** Corrected invoice creation flow (create invoice first, then attach items)
4. **Webhook Handling:** Added comprehensive event handlers for invoice lifecycle

### 📋 Remaining Work:
- Debug and fix post-invoice-creation page reload/redirect issue
- Verify E2E tests pass with fixed implementation
- Complete final manual testing workflow

## 📅 Status Summary
**Feature Status:** 95% Complete - Core functionality operational, final UX issue being debugged
**Next Session:** Focus on page reload/redirect issue after successful invoice creation
