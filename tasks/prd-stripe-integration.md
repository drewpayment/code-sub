# Product Requirements Document: Stripe Integration

## 1. Introduction/Overview

This document outlines the requirements for integrating the Stripe payment gateway into the application. The primary goal is to automate the subscription payment process, allowing customers to pay for their plans, manage their billing details, and establish a recurring payment schedule. This feature will leverage the Stripe Billing product to handle subscriptions, invoicing, and payment retries, while providing both customers and admins with clear visibility into billing history and subscription status.

## 2. Goals

-   Enable automated, recurring subscription payments for customers.
-   Provide a seamless and secure way for users to enter and manage their payment information.
-   Automate the handling of common billing events, including payment reminders, receipts, and failed payments.
-   Give administrators clear visibility into payment statuses, billing history, and overdue accounts.
-   Reduce manual administrative effort related to invoicing and collections.

## 3. User Stories

-   **As a new customer,** I want to securely enter my payment details after selecting a plan so that I can activate my subscription.
-   **As a subscribed customer,** I want to be automatically charged on my billing cycle date so that my service continues without interruption.
-   **As a subscribed customer,** I want to receive a reminder before my payment date and a receipt after my card is charged.
-   **As a customer whose payment has failed,** I want to be notified and easily update my payment information to bring my account current.
-   **As a customer,** I want to view my past 12 months of payment history so I can track my expenses.
-   **As an administrator,** I want to see which customers have overdue, canceled, or active subscriptions at a glance.
-   **As an administrator,** I want to view the complete payment history for any customer to assist with support inquiries.

## 4. Functional Requirements

### Customer-Facing Flow
1.  **Payment Setup:**
    -   When a user subscribes to a new plan, their subscription status in our database shall be set to `pending_payment_setup`.
    -   On the `/account/subscription` page, if a user's subscription status is `pending_payment_setup`, a "Complete Setup & Activate" button must be displayed.
    -   Clicking this button shall present the user with an embedded Stripe Checkout session to enter their payment details.
    -   Upon successful submission of payment details to Stripe, the user's subscription status in our database must be updated to `active`.

2.  **Failed Payments & Overdue Status:**
    -   A new subscription status, `overdue`, shall be added to the system.
    -   If a recurring payment fails and Stripe's dunning (retry) process is exhausted, the subscription status in our database must be updated to `overdue`.
    -   A user with an `overdue` subscription who logs in must be shown a persistent, non-dismissible banner prompting them to update their payment method.
    -   The `/account/subscription` page for an `overdue` account must clearly display the "Overdue" status and provide a form or link to update their payment information via Stripe.

3.  **Billing History:**
    -   The `/account/subscription` page shall include a "Billing History" section.
    -   This section must fetch and display the user's last 12 months of payment transactions from the Stripe API.
    -   The history should include the date, amount, and status (e.g., "Paid", "Failed") for each transaction.

### Admin-Facing Flow
4.  **Dashboard Reporting:**
    -   The main `/admin` dashboard shall be enhanced with a new reporting section.
    -   This section must display key metrics fetched from Stripe, including the total number of customers with `active`, `overdue`, and `canceled` subscriptions.

5.  **Customer Payment History:**
    -   A new admin page shall be created at `/admin/customers/[id]/billing`.
    -   This page must fetch and display the *complete* payment history for the selected customer directly from the Stripe API.
    -   The history must include transaction dates, amounts, statuses, and a direct link to the corresponding invoice or charge in the Stripe Dashboard.

### Backend & Integration
6.  **Stripe Object Creation:**
    -   When a user first enters their payment information, a corresponding `Customer` object must be created in Stripe. The Stripe Customer ID must be saved against the user's record in our database.
    -   When a subscription is activated, a `Subscription` object must be created in Stripe Billing, linking the Stripe Customer to the appropriate plan. The Stripe Subscription ID must be saved against the subscription record in our database.

7.  **Webhook Integration:**
    -   A webhook endpoint must be created to receive events from Stripe.
    -   This endpoint must securely handle (at a minimum) the `invoice.payment_succeeded`, `invoice.payment_failed`, and `customer.subscription.updated` events to keep our local database status synchronized with Stripe.

8.  **Automated Notifications:**
    -   The system shall leverage Stripe's built-in customer email capabilities.
    -   The following automated emails must be configured and enabled within the Stripe settings:
        -   Upcoming payment reminders (3 days in advance).
        -   Successful payment receipts.
        -   Failed payment notifications.

## 5. Non-Goals (Out of Scope)

-   **Building a custom invoicing system:** All invoicing, dunning, and recurring payment logic will be handled by Stripe Billing. We will not build this ourselves.
-   **Building a custom notification system:** All billing-related emails will be sent by Stripe. We will not build our own email-sending logic for this feature.
-   **Proration for plan changes:** Initially, this feature will not handle prorated charges for mid-cycle plan upgrades or downgrades. This can be a future enhancement.
-   **One-time purchases or charges:** This integration is focused exclusively on recurring subscription payments.

## 6. Design Considerations

-   The embedded Stripe Checkout form should be styled to match the site's existing theme as much as possible.
-   Status indicators for `overdue` subscriptions should be visually distinct and clear (e.g., using a strong red color).
-   The new admin reporting widgets should be integrated cleanly into the existing dashboard layout.

## 7. Technical Considerations

-   The implementation will rely on the official `stripe-node` library for all server-side interactions with the Stripe API.
-   Stripe API keys (secret and publishable) must be stored securely as environment variables and not committed to the repository.
-   The webhook endpoint must be protected by verifying the Stripe signature on incoming requests to prevent fraudulent calls.

## 8. Success Metrics

-   Percentage of new subscriptions that are successfully activated via Stripe within 24 hours of creation.
-   Reduction in administrative time spent on manual billing inquiries.
-   Successful, automated collection of over 95% of recurring monthly payments.
-   Clear visibility of payment statuses for all subscriptions in the admin dashboard.

## 9. Open Questions

-   None at this time. The plan provides a clear path for initial implementation. 