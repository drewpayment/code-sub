# PRD: Company Website Core Pages (Services, About, Process)

## 1. Introduction/Overview

This document outlines the requirements for creating three new core pages for the company website: **Services**, **About**, and **Process**. This feature aims to clearly communicate our service offerings, share our company's story and mission, and demystify our client engagement process. The overall goal is to build trust, generate leads, and provide a clear, professional narrative for prospective clients.

## 2. Goals

*   **Goal 1:** Clearly present all one-time and recurring service packages to potential customers.
*   **Goal 2:** Create an engaging "About Us" page that establishes a connection with visitors through our story and mission.
*   **Goal 3:** Provide a transparent and easy-to-understand overview of our client engagement process.
*   **Goal 4:** Ensure all new pages are fully responsive, visually appealing, and consistent with the existing brand identity.
*   **Goal 5:** Drive user engagement through clear calls-to-action on the Services page.

## 3. User Stories

*   **As a potential client (small business owner),** I want to easily understand the different website packages and their features so that I can choose the one that best fits my needs and budget.
*   **As a prospective customer,** I want to learn about the company's background and mission to determine if they are a good fit for my business values.
*   **As a user considering their services,** I want to see a clear outline of their work process so I know what to expect when working with them.
*   **As a site administrator,** I want the content on these pages to be easily updatable as our services and company evolve.

## 4. Functional Requirements

### 4.1. Services Page

The services page should be divided into two main sections: "One-Time Projects" and "Recurring Services".

**A. One-Time Project Tiers**
*   **Layout:** Display using a three-card layout, where each card represents a tier: "Essential Online Presence", "Enhanced Marketing Hub", and "Premium Digital Showcase".
*   **Card Content:** Each card must contain:
    *   Tier Title (e.g., "Essential Online Presence")
    *   A brief "Ideal For" description.
    *   A bulleted list of key features included in that tier.
    *   A prominent "Learn More" button.
*   **Content Source:** All content for features and descriptions should be sourced from the `services.txt` document.

**B. Recurring Service Packages**
*   **Layout:** Display using a card-based layout, similar to the project tiers, or a distinct section-based layout.
*   **Packages to Display:**
    *   Website Hosting & Maintenance
    *   SEO & Performance Optimization
    *   LLM Feature Maintenance & Enhancement
*   **Package Content:** Each package should detail:
    *   A clear title.
    *   A description of the service.
    *   A bulleted list of services included.
    *   A "Learn More" button.
*   **Combined Packages:** A final subsection should present the bundled recurring packages: "Basic Care Plan," "Growth Partner Plan," and "Premium Digital Growth Plan" with their respective inclusions.

### 4.2. About Page

*   **Layout:** A two-section layout.
*   **Section 1: About the Company:**
    *   A general section introducing the company.
    *   **Content:** Use placeholder text for now, but it should be written in a **friendly and innovative** tone.
    *   Include space for an image of the team or office.
*   **Section 2: Our Mission:**
    *   A dedicated section to outline the company's mission statement and values.
    *   **Content:** The mission should reflect a dedication to the trade, community betterment, and creating opportunities for small-to-medium businesses to succeed online.

### 4.3. Process Page

*   **Layout:** A visual, step-by-step timeline or infographic style. Use icons for each step to make it inviting and engaging.
*   **Steps:** The process should include the following stages:
    1.  **Step 1: Discovery & Consultation:**
        *   **Icon:** Magnifying glass or speech bubbles.
        *   **Description:** We start by understanding your business, goals, and target audience. This includes a deep dive into your brand and requirements.
    2.  **Step 2: Strategy & Design:**
        *   **Icon:** Blueprint or palette.
        *   **Description:** We craft a custom design and strategy based on our discovery session. You'll receive mockups and a clear plan for your website's structure and user experience.
    3.  **Step 3: Development & Implementation:**
        *   **Icon:** Code brackets (`</>`) or gears.
        *   **Description:** Our team brings the design to life, building a fast, secure, and mobile-first website with clean code and best practices.
    4.  **Step 4: Review & Launch:**
        *   **Icon:** Rocket or checkmark.
        *   **Description:** We conduct thorough testing and invite you for a final review. Once approved, we handle the deployment and launch your new website.
    5.  **Step 5: Ongoing Support & Growth:**
        *   **Icon:** Chart or wrench.
        *   **Description:** Post-launch, we offer continuous support, maintenance, and optimization services to ensure your website remains a powerful asset for your business.

## 5. Non-Goals (Out of Scope)

*   This feature will not include a blog.
*   This feature will not include e-commerce functionality (e.g., shopping cart, payment processing).
*   The "Learn More" buttons will initially link to a contact form or a designated section on the contact page; they will not open unique pages for each service.
*   No content management system (CMS) will be built for these pages in this phase. Content updates will be done through the codebase.

## 6. Design & Technical Considerations

*   **Design:** The design must be clean, modern, and professional. It should align with the existing website's branding (fonts, colors, etc.). The tone should be friendly and innovative.
*   **Technology:** The pages should be built as static components within the existing site structure (e.g., using React/Vue components, or static HTML/CSS files, depending on the current stack).
*   **Responsiveness:** All pages must be fully responsive and optimized for desktop, tablet, and mobile devices.

## 7. Success Metrics

*   Increase in lead generation inquiries that reference one of the service packages.
*   Positive user feedback on the clarity and usefulness of the new pages.
*   An increase in time spent on the site by new visitors.

## 8. Open Questions

*   Where should the "Learn More" buttons navigate the user to? (Assumption: Contact page/form).
*   What specific imagery should be used for the About page? (To be provided by the client later). 