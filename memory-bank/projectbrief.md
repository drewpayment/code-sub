# Project Brief: Authentication Security Improvements & Privacy Policy

## Overview
This feature addresses critical user experience and security issues in the current authentication system. The goal is to create a secure, user-friendly authentication experience that follows security best practices while maintaining a smooth user interface.

## Key Goals
1.  **Improve Login Error Handling**: Replace raw API error responses with user-friendly error messages that maintain form state.
2.  **Enhance Form Validation UX**: Show validation errors inline without clearing form data.
3.  **Implement Security Measures**: Add rate limiting (5 attempts/minute/IP) and account protection against brute force attacks (lockout after 5 failed attempts).
4.  **Create Privacy Policy**: Write and implement a comprehensive privacy policy page at `/privacy-policy`.
5.  **Update Registration Flow**: Add a privacy policy acknowledgment to user registration.

## Technical Stack
-   **Backend**: PocketBase with local username/password authentication.
-   **Frontend**: SvelteKit.
-   **Security**: Follow OWASP guidelines for authentication security.

## Phased Implementation
-   **Phase 1 (High Priority)**: Fix login error handling, implement basic rate limiting, create privacy policy.
-   **Phase 2 (Medium Priority)**: Enhanced security logging, password reset UI improvements, registration disclaimer.
-   **Phase 3 (Lower Priority)**: Advanced rate limiting, security monitoring, privacy policy versioning.

## Project Overview
This is a SvelteKit web application project focused on implementing three core static pages: Services, About, and Process. The project emphasizes component-based architecture, responsive design, and server-side data processing.

## Current Objective
**Level 3 Task:** Implement Core Pages (Services, About, Process)
- Create fully responsive pages based on PRD specifications
- Implement reusable Svelte components
- Parse and display service data from text files
- Build an interactive process timeline

## Tech Stack
- **Framework:** SvelteKit
- **Styling:** TailwindCSS
- **Icons:** Lucide Svelte
- **Package Manager:** Bun
- **Language:** TypeScript

## Project Structure
- Frontend: SvelteKit application with component-based architecture
- Data: Server-side parsing of text-based content files
- Styling: TailwindCSS with custom component classes
- Components: Modular Svelte components in `src/lib/components/`

## Success Criteria
- Three fully functional and responsive pages
- Reusable component library
- Clean, maintainable code architecture
- Consistent branding and styling
- Proper data parsing and display 