# PRD: Subscription & Customer Management

## 1. Introduction/Overview

This document outlines the requirements for a new Subscription and Customer Management feature. The primary goal is to empower internal team members (Admins, Employees, etc.) to manage customer accounts, assign subscription plans, and track subscription statuses directly within the application.

This feature is the foundational step towards full billing integration with Stripe. It focuses on creating the necessary data structures, user roles, and internal UIs to handle subscriptions before any payment processing is implemented.

## 2. Goals

-   To establish a clear, role-based permission system for distinguishing between internal employees and external customers.
-   To create a centralized dashboard where authorized employees can view and manage all customer accounts.
-   To enable employees to assign specific subscription plans to customers.
-   To enable employees to terminate a customer's subscription.
-   To provide customers with a dedicated area in their account to view their current subscription status.
-   To implement an email notification system to inform customers when a subscription has been assigned to them, prompting them to complete billing setup (in a future feature).

## 3. User Stories

-   **As an Admin,** I want to view a list of all registered customers so that I can monitor sign-ups and manage their accounts.
-   **As an Employee,** I want to assign a "Premium Care" plan to a new customer so that they can be prepared for billing.
-   **As an Employee,** I want to terminate a customer's active subscription because they have requested to cancel their service.
-   **As a Customer,** I want to receive an email notification when a plan is assigned to me so that I know to take the next step.
-   **As a Customer,** I want to log into my account and see which subscription plan I am on and its current status.

## 4. Functional Requirements

### 4.1. User Role System

1.  The system must extend the existing `users` collection with a `role` field.
2.  The `role` field must be an enum (select field) with the following options:
    -   `customer` (default for all new sign-ups)
    -   `employee`
    -   `manager`
    -   `admin`
    -   `super_admin`
3.  Only `super_admin` users should be able to change another user's role.

### 4.2. Admin Dashboard: Customer Management

1.  There must be a new, protected route (e.g., `/admin/users`) accessible only to users with roles `employee`, `manager`, `admin`, or `super_admin`.
2.  This page will display a table of all users with the `customer` role.
3.  The table must include the following columns: User Name, Email, Sign-up Date, Subscription Plan, and Subscription Status.
4.  The dashboard must provide a way to click into a specific customer's detail view.

### 4.3. Admin Dashboard: Subscription Management

1.  From a customer's detail view, an authorized employee must be able to assign a subscription plan to that customer.
2.  The interface should present a list of available plans to choose from.
3.  Upon assigning a plan, a new `subscription` record must be created, linking the user and the plan.
4.  The newly created subscription will have a default status of `pending_payment_setup`.
5.  An authorized employee must be able to terminate an active subscription.
6.  Terminating a subscription will set its status to `terminated`. This action does **not** delete the user or restrict their access to their account.

### 4.4. Customer Account View

1.  The existing `/account` page must be updated to include a "Subscription" section.
2.  This section will display the customer's currently assigned plan (e.g., "Premium Care").
3.  It will also display the current status of the subscription (e.g., "Active," "Pending Payment Setup," "Terminated").

### 4.5. Email Notifications

1.  When an employee assigns a plan to a customer, the system must automatically trigger an email to that customer.
2.  The email template should be named "Subscription Pending" and inform the user that a plan has been assigned to their account.
3.  The email must contain a call-to-action link that directs the user to their `/account` page to review the subscription.

## 5. Non-Goals (Out of Scope for this Iteration)

-   **Payment Processing:** This feature will **not** handle any credit card processing, billing cycles, or financial transactions.
-   **Stripe SDK Integration:** No part of the Stripe SDK will be installed or used. All Stripe-related functionality is deferred.
-   **Automated Subscription Changes:** Customers cannot change, upgrade, or cancel their own plans from the UI in this version. All subscription changes are initiated by an employee.
-   **Plan Feature Gating:** Assigning a plan will not yet unlock or restrict any specific application features for the user.

## 6. Design Considerations

-   The admin dashboard should be clean, functional, and prioritize clarity of information. It should follow the existing application's design system for tables, buttons, and forms.
-   The new "Subscription" section on the customer's `/account` page should be clearly separated from existing account information and visually indicate the subscription status (e.g., using badges or colored text).

## 7. Technical Considerations

### 7.1. Data Models (PocketBase)

-   **`users` (Auth Collection - Modified):**
    -   Add a new `role` select field (see FR 4.1.2 for values).
-   **`plans` (Base Collection - New):**
    -   `name`: Text (e.g., "Essential Care")
    -   `description`: Text
    -   `price`: Number (e.g., 49)
    -   `features`: JSON or Text (to store list of features)
    -   `active`: Boolean (to allow retiring old plans)
    *Initial data for this collection can be sourced from `src/routes/pricing/+page.svelte`.*
-   **`subscriptions` (Base Collection - New):**
    -   `user`: Relation to `users` collection.
    -   `plan`: Relation to `plans` collection.
    -   `status`: Select field (`pending_payment_setup`, `active`, `payment_failed`, `terminated`, `cancelled`).
    -   `stripe_subscription_id`: Text (placeholder for future Stripe integration).

### 7.2. Future Stripe Integration Tasks (For Planning)

-   Create secure backend endpoints to handle Stripe webhooks.
-   Implement Stripe Checkout session creation when a user sets up billing.
-   Update subscription status based on webhook events (e.g., `invoice.paid` -> `active`, `customer.subscription.deleted` -> `cancelled`).

## 8. Success Metrics

-   100% of new customer sign-ups are correctly assigned the default "customer" role.
-   Employees can successfully assign and terminate subscriptions for any customer through the admin UI.
-   Customers can view their assigned plan and status on their account page.

## 9. Open Questions

-   For customers created by an admin (who may not have a password yet), should the "Subscription Pending" email also include a link to set their account password for the first time? 