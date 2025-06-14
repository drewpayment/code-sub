# PRD: Contact Forms Implementation

## Introduction/Overview

This feature implements functional contact forms across three key touchpoints in the application: the main contact page (`/contact`), the "Get a free quote" button on the services page (`/services`), and the "Choose plan" button on the pricing page (`/pricing`). Currently, these forms are non-functional and need to be built from the ground up with proper form handling, validation, and data storage.

The goal is to create a seamless lead capture system that allows potential clients to reach out for services, request quotes, and select pricing plans, with all submissions stored in a centralized database for easy follow-up.

## Goals

1. **Enable Lead Capture:** Make all contact forms functional to capture potential client information
2. **Consistent User Experience:** Provide uniform form behavior and styling across all touchpoints
3. **Data Management:** Store all form submissions in a centralized PocketBase collection
4. **User Feedback:** Provide clear confirmation when forms are successfully submitted
5. **Context Awareness:** Capture additional context (like selected pricing plan) when relevant

## User Stories

1. **As a potential client visiting the contact page**, I want to fill out a contact form with my details so that the company can reach out to me about my project needs.

2. **As a user browsing services**, I want to request a free quote by clicking a button and filling out a form so that I can get pricing information for specific services.

3. **As a user comparing pricing plans**, I want to choose a plan and submit my contact information so that the company can help me get started with that specific plan.

4. **As a user submitting any form**, I want to see clear validation errors if I make mistakes so that I can correct them before submitting.

5. **As a user who successfully submits a form**, I want to see a confirmation message so that I know my request was received and understand next steps.

## Functional Requirements

### Core Form Functionality
1. **The system must collect the following information from all forms:**
   - Name (required)
   - Email address (required)
   - Phone number (required)
   - Project description (optional)

2. **The system must validate form inputs:**
   - Name: Required, minimum 2 characters
   - Email: Required, valid email format
   - Phone: Required, valid phone number format
   - Project description: Optional, maximum character limit (e.g., 1000 characters)

3. **The system must display validation errors inline with form fields** when users submit invalid data.

4. **The system must store all form submissions in a PocketBase collection** with the following fields:
   - name
   - email
   - phone
   - description
   - source (contact, services, pricing)
   - selected_plan (for pricing page submissions)
   - created_at timestamp

### Form-Specific Requirements
5. **Contact Page Form (`/contact`):**
   - Display as a standard form on the page
   - Source field should be set to "contact"
   - No additional hidden fields required

6. **Services Page Quote Form (`/services`):**
   - Triggered by "Get a free quote" button
   - Can be implemented as modal/popup or redirect to form page
   - Source field should be set to "services"
   - No additional hidden fields required

7. **Pricing Page Plan Selection (`/pricing`):**
   - Triggered by "Choose plan" button for each pricing tier
   - Can be implemented as modal/popup or redirect to form page
   - Source field should be set to "pricing"
   - Selected_plan field should capture which plan was chosen (hidden from user)

### Success Handling
8. **The system must provide success confirmation:**
   - For full-page forms: Redirect to a dedicated thank you page
   - For modal/popup forms: Display thank you message in modal format
   - Thank you message should inform users they will be contacted ASAP

9. **The thank you page/message must:**
   - Confirm the form submission was successful
   - Set expectations for follow-up timing
   - Provide any additional next steps or contact information

### Error Handling
10. **The system must handle submission failures gracefully:**
    - Display user-friendly error messages
    - Preserve form data when errors occur
    - Provide clear instructions for resolution

## Non-Goals (Out of Scope)

1. **Email notifications** - Initial version will not send automatic emails
2. **CRM integration** - Data will be stored in PocketBase only
3. **Advanced form analytics** - No tracking of form abandonment or conversion rates
4. **File upload functionality** - Users cannot attach files to submissions
5. **Multi-step forms** - All forms will be single-page submissions
6. **Calendar integration** - No scheduling functionality in initial version

## Design Considerations

1. **Form Consistency:** All forms should use identical styling, layout, and component structure
2. **Responsive Design:** Forms must work seamlessly on mobile, tablet, and desktop devices
3. **Accessibility:** Forms should follow WCAG guidelines for accessibility
4. **Visual Hierarchy:** Clear labeling, proper spacing, and intuitive flow
5. **Loading States:** Show loading indicators during form submission
6. **Error States:** Clear, actionable error messaging with appropriate styling

## Technical Considerations

1. **SvelteKit Form Actions:** Use SvelteKit's recommended form handling with `use:enhance` and form actions
2. **PocketBase Integration:** Create appropriate collection schema and API endpoints
3. **Validation:** Implement both client-side and server-side validation
4. **Security:** Implement CSRF protection and input sanitization
5. **Performance:** Optimize form submission handling to avoid blocking UI
6. **Progressive Enhancement:** Forms should work without JavaScript as a fallback

### PocketBase Collection Schema
```javascript
{
  name: "text (required)",
  email: "email (required)", 
  phone: "text (required)",
  description: "text (optional)",
  source: "select (contact|services|pricing)",
  selected_plan: "text (optional)",
  created: "date (auto)"
}
```

## Success Metrics

1. **Functional Success:** All three form touchpoints successfully capture and store user data
2. **User Experience:** Forms can be submitted without errors and provide clear feedback
3. **Data Quality:** Submitted data is properly validated and stored in correct format
4. **Consistency:** All forms provide identical user experience and functionality
5. **Accessibility:** Forms are usable by users with disabilities and assistive technologies

## Open Questions

1. **Modal vs. Redirect:** Should the services and pricing forms open in modals/popups or redirect to dedicated form pages?
2. **Thank You Page Design:** Should there be one generic thank you page or different pages for each form source?
3. **Phone Number Format:** Any specific phone number format requirements or international support needed?
4. **PocketBase Authentication:** Will form submissions require any authentication or can they be anonymous?
5. **Rate Limiting:** Should there be any rate limiting to prevent spam submissions?
6. **Follow-up Process:** How will the team be notified of new form submissions for follow-up?

---

**Priority:** High  
**Estimated Effort:** Medium  
**Dependencies:** PocketBase setup, existing form components review 