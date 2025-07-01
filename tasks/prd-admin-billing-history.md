# PRD: Admin Customer Billing History

## 1. Introduction/Overview
This document outlines the requirements for an **Admin Customer Billing History** page. This feature will provide administrators with a comprehensive view of a customer's financial history, including all payments, refunds, and key economic metrics. The goal is to empower the admin team with the necessary data to understand a customer's economic relationship with the platform and to effectively handle billing-related support queries without needing to leave the application to check Stripe.

## 2. Goals
- To provide a single, clear interface for admins to review a customer's complete billing history.
- To display key economic metrics (MRR, LTV) for each customer to enable better financial analysis.
- To reduce the time admins spend in the external Stripe dashboard for routine billing questions.
- To improve the quality and speed of customer support for payment-related issues.

## 3. User Stories
- **As an admin,** I want to view a detailed list of all payments and refunds for a specific customer so that I can accurately answer their billing questions.
- **As an admin,** I want to see high-level financial metrics like Lifetime Value for a customer so that I can quickly assess their economic importance.
- **As an admin,** I want to filter a customer's transaction history by date range and type so that I can efficiently locate specific events.

## 4. Functional Requirements

1.  **New Page Creation:**
    -   A new page, "Billing History," shall be created.
    -   This page will be accessible from the individual customer detail page (e.g., `/admin/customers/[id]`).

2.  **Navigation:**
    -   A "View Billing History" button or link shall be added to the customer detail page to navigate to this new page.

3.  **Key Economic Metrics Display:**
    -   The page must display the following key metrics prominently at the top:
        -   **Monthly Recurring Revenue (MRR):** The current monthly revenue from the customer's active subscriptions.
        -   **Lifetime Earnings:** The total sum of all successful payments from the customer.
        -   **Lifetime Value (LTV):** Calculated as (Lifetime Earnings - Total Refunded Amount).

4.  **Billing History Table:**
    -   The page must feature a table listing all billing events for the customer.
    -   The table must include the following columns:
        -   **Date:** The date the event occurred.
        -   **Type:** The type of event (e.g., "Payment", "Refund").
        -   **Amount:** The monetary value of the event. Refunds should be clearly indicated (e.g., with a negative sign or in red).
        -   **Plan:** The subscription plan associated with the event.
        -   **Status:** The outcome of the event (e.g., "Succeeded", "Failed").
        -   **Details:** A link to view the corresponding invoice or transaction directly in Stripe (should open in a new tab).

5.  **Filtering Capabilities:**
    -   The billing history table must default to showing transactions from the **last 12 months**.
    -   The user must be able to filter the table by:
        -   **Date Range:** Pre-set options (e.g., "Last 30 Days," "Last 90 Days," "All Time") and a custom date range picker.
        -   **Transaction Type:** A dropdown or buttons to filter by "Payment" or "Refund".

6.  **Access Control:**
    -   This page and its data must only be accessible to users with the role of `admin` or `super_admin`.

## 5. Non-Goals (Out of Scope)
-   **No Admin Actions:** Admins will **not** be able to initiate any actions (e.g., issue refunds, resend invoices, cancel subscriptions) from this page in this version. It is a read-only view.
-   **No Data Visualizations:** This version will not include any charts or graphs.
-   **No Real-time Processing:** The page will display historical data fetched from Stripe, not a live feed of in-progress transactions.

## 6. Design Considerations
-   The new "Billing History" page should adhere to the established styles of the existing Code-Sub Admin dashboard for consistency.
-   The layout should be clean and prioritize clarity, with the key metrics displayed as "stat cards" above the filterable table.

## 7. Technical Considerations
-   The backend logic will need to communicate directly with the Stripe API to fetch invoice and refund data.
-   The key economic metrics (MRR, LTV, etc.) should be calculated on the server-side.
-   To ensure performance, filtering operations on the billing history table should be handled by server-side API calls to Stripe rather than fetching the entire dataset to the client.

## 8. Success Metrics
-   Reduction in the frequency admins need to log into the Stripe dashboard to look up customer billing information.
-   Positive qualitative feedback from the admin team on the utility and clarity of the new page.

## 9. Open Questions
-   How should MRR be calculated for a customer with multiple active subscriptions? (For this version, we will assume a customer can only have one active subscription at a time). 