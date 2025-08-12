## Pages & Routing

All routes are built using the Next.js App Router.

### `/`
- Component: `src/app/page.tsx`
- Behavior:
  - If unauthenticated: redirects to `/login`
  - If Supabase recovery token exists in the hash: shows inline password reset overlay
  - When authenticated: shows dashboard with Header, Stats, QuickActions, SearchFilter, and TaskList. A modal `TaskForm` opens for adding tasks.

### `/login`
- Component: `src/app/login/page.tsx`
- Behavior:
  - Sign in with email/password
  - Toggle to sign up mode
  - On successful sign in: navigates to `/`
  - On successful sign up without immediate session: shows confirmation message

### `/forgot-password`
- Component: `src/app/forgot-password/page.tsx`
- Behavior: Submits email to receive a reset link via the backend.

### `/reset-password`
- Component: `src/app/reset-password/page.tsx`
- Behavior:
  - Reads `access_token` and `refresh_token` from URL hash
  - Calls Supabase `setSession` and then `updateUser` to set new password
  - On success: navigates to `/login`

### Layout
- Component: `src/app/layout.tsx`
- Provides: `ThemeProvider`, `AuthProvider`, `CategoryProvider`, and `TaskProvider` to all routes.