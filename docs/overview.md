## Overview

Task Vault is a modern task management frontend built with Next.js (App Router) and React 19. It provides authentication, tasks and categories management, and a dark-first UI.

### Architecture
- UI Components in `src/components/`
- Pages in `src/app/`
- State management via React Contexts in `src/contexts/`
- API abstraction in `src/services/api.ts`
- Shared types in `src/types/`
- Utilities in `src/utils/`

### Data flow
- UI triggers actions → Context methods → `apiService` HTTP calls → Remote backend → Context updates state → UI re-renders

### Providers tree
The root layout composes providers so that hooks are available across the app:

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <CategoryProvider>
              <TaskProvider>
                {children}
              </TaskProvider>
            </CategoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Routing
- `/` dashboard (requires auth; also supports inline password recovery)
- `/login` sign in / sign up
- `/forgot-password` request reset link
- `/reset-password` complete password reset (token via URL hash)