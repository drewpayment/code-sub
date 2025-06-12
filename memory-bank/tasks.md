# Task Plan: Implement Core Pages (Services, About, Process)

- **Complexity:** Level 3
- **PRD:** [prd-static-pages.md](mdc:.tasks/docs/prd-static-pages.md)

---

## 1. Requirements Analysis

The goal is to implement three new, fully responsive pages based on the PRD:
- **Services Page:** Display one-time and recurring service tiers from a text file in a card-based layout.
- **About Page:** Introduce the company and its mission in a friendly, innovative tone.
- **Process Page:** Visually explain the 5-step client engagement process using a timeline with icons.

## 2. Components Affected & To Create

### Existing Files to Modify:
- `src/routes/services/+page.svelte`
- `src/routes/about/+page.svelte`
- `src/routes/process/+page.svelte`

### New Components to Create:
- `src/lib/components/ServiceCard.svelte`: A reusable card to display a service tier (one-time or recurring).
- `src/lib/components/ProcessStep.svelte`: A component for a single step in the process timeline, containing an icon, title, and description.

## 3. Architecture Considerations

- **Data Loading (Services Page):** The content for the services page is in `services.txt`. This data should be parsed on the server to avoid shipping a large text file and parsing logic to the client. We will create a `src/routes/services/+page.server.ts` file to handle this. The parser will need to be robust enough to separate tiers and their features.
- **Component-Based Structure:** We will continue using Svelte's component model to ensure the UI is modular and maintainable. The new components (`ServiceCard`, `ProcessStep`) will be placed in `src/lib/components/` and exported via `src/lib/components/index.ts`.
- **Styling:** We will use TailwindCSS and the existing styles in `src/app.css` to ensure visual consistency.

## 4. Implementation Strategy

The implementation will be done in the following order:

1.  **Data Parsing:** Develop the server-side logic to parse `services.txt`.
2.  **Component Creation:** Build the `ServiceCard.svelte` and `ProcessStep.svelte` components.
3.  **Page Implementation:**
    -   Implement the **Services** page, feeding the parsed data into `ServiceCard` components.
    -   Implement the **About** page using a straightforward two-section layout.
    -   Implement the **Process** page, using `ProcessStep` components to build the timeline.
4.  **Styling & Responsive Design:** Ensure all pages are styled according to the brand and are fully responsive.

## 5. Detailed Steps (Implementation Checklist)

-   [ ] **1. Setup:**
    -   [ ] Create `src/routes/services/+page.server.ts`.
    -   [ ] Create `src/lib/components/ServiceCard.svelte`.
    -   [ ] Create `src/lib/components/ProcessStep.svelte`.
    -   [ ] Export new components from `src/lib/components/index.ts`.

-   [ ] **2. Data Parsing (`+page.server.ts`):**
    -   [ ] Read the `services.txt` file.
    -   [ ] Write a function to parse the text into a structured JSON-like object (e.g., `{ oneTime: [...], recurring: [...] }`).
    -   [ ] Pass the parsed data to the `+page.svelte` component from the `load` function.

-   [ ] **3. `ServiceCard.svelte` Component:**
    -   [ ] Define props for `title`, `idealFor`, `features` (as an array), and `learnMoreLink`.
    -   [ ] Style the card using the `.card` class from `app.css`.
    -   [ ] Add a "Learn More" button styled with `.btn` and `.btn-primary`.

-   [ ] **4. `ProcessStep.svelte` Component:**
    -   [ ] Define props for `icon`, `title`, `description`, and `stepNumber`.
    -   [ ] Style the component to be part of a vertical timeline.

-   [ ] **5. Services Page (`/services`):**
    -   [ ] Receive the parsed service data from the `load` function.
    -   [ ] Create a section for "One-Time Projects" and iterate through the data, rendering a `ServiceCard` for each tier.
    -   [ ] Create a section for "Recurring Services" and do the same.

-   [ ] **6. About Page (`/about`):**
    -   [ ] Create a top section for "About the Company" with placeholder text.
    -   [ ] Create a bottom section for "Our Mission" with the specified content.
    -   [ ] Use friendly and innovative styling.

-   [ ] **7. Process Page (`/process`):**
    -   [ ] Manually define an array with the 5 process steps (icon, title, description).
    -   [ ] Iterate through the array and render a `ProcessStep` for each, creating the visual timeline.

-   [ ] **8. Final Review:**
    -   [ ] Verify all pages are responsive on mobile, tablet, and desktop.
    -   [ ] Check for consistent styling and branding.
    -   [ ] Confirm all links and buttons work as expected.

## 6. Dependencies

- **Icons:** We will need SVG icons for the process page. We can use a library like `lucide-svelte` if it's already a dependency, or find suitable SVG icons to include directly. A quick check of `package.json` confirms `lucide-svelte` is available.
- **Content:** The `services.txt` file is a critical content dependency.

## 7. Challenges & Mitigations

- **Challenge:** The `services.txt` parser might be complex.
  - **Mitigation:** I will build it step-by-step with clear delimiters (like `---` and `####`) to ensure it's reliable.
- **Challenge:** Creating a visually appealing and responsive timeline for the process page can be tricky with CSS.
  - **Mitigation:** I will use Tailwind's flexbox and grid utilities carefully and add connecting lines using pseudo-elements (`::before`, `::after`) to create the timeline effect.

## 8. Creative Phase Components

- The visual implementation of the **Process Page Timeline** is flagged as a creative component. The initial implementation will be functional and clean, but it could be revisited later for more elaborate animations or graphical enhancements if desired.

---
I will now proceed with the implementation based on this plan. 