# System Patterns: SvelteKit & Contact Forms Architecture

## Framework Architecture
**Framework:** SvelteKit
**Routing:** File-based routing system
**Rendering:** Server-side rendering with hydration
**State Management:** Svelte stores + form state management

## Form Handling Patterns
**Form Actions:** SvelteKit form actions with `use:enhance`
**Progressive Enhancement:** Forms work without JavaScript
**Validation Strategy:** Dual client-side and server-side validation
**Error Handling:** Inline field validation with graceful fallbacks

## Component Architecture
**Location:** `src/lib/components/`
**Export Pattern:** Centralized exports via `src/lib/components/index.ts`
**Naming Convention:** PascalCase for component files
**Props Pattern:** TypeScript interfaces for component props

### Form Component Patterns
**ContactForm:** Main form component with customizable props
- Props: source, selectedPlan, onSuccess, showDescription
- Validation: Real-time feedback with error states
- Submission: Integrated with SvelteKit form actions

**FormField:** Reusable input component
- Props: type, name, label, required, validation, placeholder
- States: default, focused, error, success
- Accessibility: ARIA labels and descriptions

**SubmitButton:** Form submission with loading states
- Props: loading, disabled, text, loadingText
- States: default, loading, success, error
- UX: Prevents double submission

## Data Handling Patterns
**Server-Side Processing:** `+page.server.ts` files for form actions
**Client-Side Enhancement:** Progressive enhancement with `use:enhance`
**Database Integration:** PocketBase collection management
**Data Structure:** Consistent form data schema across touchpoints

## Database Patterns (PocketBase)
**Collection Schema:** `contact_submissions`
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

**API Integration:** Direct PocketBase SDK usage
**Error Handling:** Graceful fallbacks for database failures
**Data Validation:** Schema-level and application-level validation

## File Organization
```
src/
├── lib/
│   └── components/
│       ├── ContactForm.svelte
│       ├── FormField.svelte
│       ├── SubmitButton.svelte
│       └── index.ts
├── routes/
│   ├── contact/
│   │   ├── +page.svelte
│   │   └── +page.server.ts
│   ├── services/
│   │   └── +page.svelte (with form integration)
│   ├── pricing/
│   │   └── +page.svelte (with form integration)
│   └── thank-you/
│       └── +page.svelte
└── app.css
```

## Form Validation Patterns
**Client-Side Validation:**
- Real-time feedback on field blur/change
- Visual indicators (error states, success states)
- Accessibility-compliant error messaging

**Server-Side Validation:**
- Schema validation before database insertion
- Sanitization of user inputs
- CSRF protection and security measures

**Error Display Patterns:**
- Inline field errors with specific messaging
- Form-level error summary for screen readers
- Preservation of form data on validation failures

## Success Handling Patterns
**Thank You Page:** Dedicated success page with clear next steps
**Modal Success:** In-context success messages for popup forms
**Redirect Logic:** Consistent success flow across touchpoints
**User Feedback:** Clear confirmation messaging and expectations

## Security Patterns
**CSRF Protection:** Built-in SvelteKit CSRF tokens
**Input Sanitization:** Server-side data cleaning
**Rate Limiting:** Protection against spam submissions (if implemented)
**Data Privacy:** Secure handling of personal information

## Responsive Design Patterns
**Mobile-First:** Touch-friendly form controls
**Adaptive Layout:** Form layouts adapt to screen size
**Input Optimization:** Appropriate input types for mobile keyboards
**Accessibility:** Screen reader and keyboard navigation support

## Integration Patterns
**Multi-Touchpoint:** Consistent form behavior across pages
**Context Passing:** Hidden fields for source and plan tracking
**Component Reusability:** Shared components with prop customization
**Progressive Enhancement:** Graceful degradation without JavaScript

## Error Recovery Patterns
**Form State Preservation:** Maintain user input on errors
**Network Failure Handling:** Offline-first error messaging
**Database Error Handling:** Graceful fallbacks for PocketBase failures
**User Guidance:** Clear instructions for error resolution

## Component Patterns
**ServiceCard:** Reusable card component for service display
- Props: title, idealFor, features, learnMoreLink
- Styling: `.card` class with TailwindCSS utilities

**ProcessStep:** Timeline step component
- Props: icon, title, description, stepNumber
- Styling: Vertical timeline with connecting elements

## Data Parsing Patterns
**Text File Processing:** Server-side parsing in `+page.server.ts`
**Delimiter Strategy:** Use `---` and `####` for section separation
**Error Handling:** Graceful fallbacks for parsing failures
**Performance:** Process data on server to reduce client load

## Styling Patterns
**CSS Framework:** TailwindCSS
**Custom Classes:** Defined in `src/app.css`
**Component Styling:** Class-based styling with Tailwind utilities
**Responsive Design:** Mobile-first approach with Tailwind breakpoints 