# PRD: User Authentication and Login Flow

## 1. Introduction/Overview

This document outlines the requirements for implementing a user authentication system. The primary goal is to allow users to create an account and log in to manage their subscription information, including their chosen plan and billing details. This feature involves creating new login and registration pages, integrating with a Pocketbase instance for authentication, and updating the site header to reflect the user's login status.

## 2. Goals

-   Enable users to register for a new account.
-   Allow registered users to log in using their email and password.
-   Provide a "Forgot Password" flow for users to reset their credentials.
-   Protect user-specific information, such as subscription plans and billing details.
-   Update the UI, specifically the header, to show a logged-in state.
-   Ensure the new pages align with the existing design language of the application.

## 3. User Stories

-   **As a new user,** I want to register for an account using my name, email, and a password so that I can access and manage my service subscription.
-   **As a returning user,** I want to log in with my email and password so that I can view my account information.
-   **As a logged-in user,** I want the website header to show that I am signed in, so I have a clear path to my account page.
-   **As a user who has forgotten my password,** I want a way to reset it securely so I can regain access to my account.

## 4. Functional Requirements

### 4.1. General Flow
-   The "Sign In" button in the `Header.svelte` component shall be updated to link to a new `/login` page.
-   Upon successful login or registration, the user will be redirected to the homepage (`/`).
-   After a user logs in, the `Header.svelte` component must be updated to reflect the authenticated state (e.g., showing user's name or an "Account" link and a "Logout" button).

### 4.2. Registration Page (`/register`)
-   A new page must be created at `/register`.
-   The page must contain a registration form with the following fields:
    -   Name (text input)
    -   Email (email input)
    -   Password (password input)
    -   Confirm Password (password input)
-   The password must have a minimum length of 8 characters.
-   The "Confirm Password" field must match the "Password" field for the form to be valid. This field is for confirmation only and should not be persisted.
-   The registration form should have a link to the `/login` page for users who already have an account.

### 4.3. Login Page (`/login`)
-   A new page must be created at `/login`.
-   The page must contain a login form with the following fields:
    -   Email (email input)
    -   Password (password input)
-   The login page will include a link to the `/register` page for new users.
-   The page will include a "Forgot Password?" link.

### 4.4. Password Reset
-   Clicking "Forgot Password?" on the login page will initiate the Pocketbase password reset flow.
-   A new page must be created to handle the password reset confirmation, where the user will enter the reset token from their email, their new password, and confirm the new password.

### 4.5. Error Handling
-   If a login attempt fails due to incorrect credentials or other server-side issues, a generic "Invalid credentials" message will be displayed to the user.
-   Form fields should have appropriate client-side validation (e.g., email format, password length).

## 5. Non-Goals (Out of Scope)

-   "Remember Me" functionality on the login form.
-   Social media logins (e.g., Google, GitHub, etc.).

## 6. Design Considerations

-   The login, registration, and password reset pages should match the visual style, look, and feel of the existing homepage (`src/routes/+page.svelte`).
-   This includes using existing color schemes, fonts, and component styles (e.g., `btn`, `btn-primary`).
-   The layout should be clean, intuitive, and responsive, ensuring a good user experience on both desktop and mobile devices.

## 7. Technical Considerations

-   All authentication logic will be handled using the `pocketbase` JavaScript SDK.
-   The target Pocketbase instance is hosted at: `https://pocketbase.hoytlabs.cloud/`
-   The user's authentication state should be managed globally, likely using a Svelte store that wraps the `pb.authStore`.

### 7.1. User Login Implementation
```javascript
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.hoytlabs.cloud');

// ...

const authData = await pb.collection('users').authWithPassword(
    'YOUR_EMAIL',
    'YOUR_PASSWORD',
);

// After the above you can also access the auth data from the authStore
console.log(pb.authStore.isValid);
console.log(pb.authStore.token);
console.log(pb.authStore.record.id);

// "logout"
pb.authStore.clear();
```

### 7.2. Password Reset Implementation
```javascript
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.hoytlabs.cloud');

// ...

// Requesting a password reset
await pb.collection('users').requestPasswordReset('test@example.com');

// ---
// On the custom confirmation page:
// ---

// note: after this call all previously issued auth tokens are invalidated
await pb.collection('users').confirmPasswordReset(
    'RESET_TOKEN',
    'NEW_PASSWORD',
    'NEW_PASSWORD_CONFIRM',
);
```

### 7.3. User Registration
-   The `pb.collection('users').create()` method will be used to register new users, passing in the `name`, `email`, `password`, and `passwordConfirm` fields.


## 8. Success Metrics

-   New users can successfully create an account and log in.
-   Existing users can successfully log in.
-   The header UI correctly updates to show the logged-in state.
-   Users can successfully use the "Forgot Password" feature to reset their credentials.
-   Future protected routes/pages are inaccessible to unauthenticated users.

## 9. Open Questions

-   How should the header display the authenticated state? Should it show the user's name, a generic "Account" link, or something else? 