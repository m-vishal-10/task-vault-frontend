## Contexts (Providers and Hooks)

All hooks must be used under their respective Providers. Providers are already composed in `src/app/layout.tsx`.

### AuthContext
- Hook: `useAuth()`
- Provider: `AuthProvider`
- State shape: `{ user, session, loading, error }`
- Methods:
  - `signup(email, password)` → Promise<void>
  - `signin(email, password)` → Promise<void>
  - `signout()` → Promise<void>
  - `refreshUser()` → Promise<void>
  - `forgotPassword(email)` → Promise<void>
  - `resetPassword(accessToken, refreshToken, newPassword)` → Promise<void>

Example:
```tsx
import { useAuth } from '@/contexts/AuthContext';

export function AccountMenu() {
  const { user, loading, signout } = useAuth();
  if (loading) return <span>Loading…</span>;
  if (!user) return <a href="/login">Login</a>;
  return (
    <button onClick={() => void signout()}>Sign out {user.email}</button>
  );
}
```

### TaskContext
- Hook: `useTasks()`
- Provider: `TaskProvider`
- State: `{ tasks, filteredTasks, loading, error, currentFilter, searchQuery, categoryFilter }`
- Methods:
  - `loadTasks()` → Promise<void>
  - `createTask(taskData)` → Promise<void>
  - `updateTask(taskId, updates)` → Promise<void>
  - `deleteTask(taskId)` → Promise<void>
  - `refreshTasks()` → Promise<void>
  - `setFilter('all' | 'active' | 'completed')`
  - `setSearch(query: string)`
  - `setCategoryFilter(category: string | null)`

Example:
```tsx
import { useTasks } from '@/contexts/TaskContext';

export function AddQuickTask() {
  const { createTask } = useTasks();
  return (
    <button
      onClick={() =>
        createTask({ title: 'New Task', priority: 'medium' })
      }
    >
      Add Task
    </button>
  );
}
```

### CategoryContext
- Hook: `useCategories()`
- Provider: `CategoryProvider`
- State: `{ categories, loading, error }`
- Methods:
  - `loadCategories()` → Promise<void>
  - `createCategory(name: string)` → Promise<Category>
  - `refreshCategories()` → Promise<void>

Example:
```tsx
import { useCategories } from '@/contexts/CategoryContext';

export function CategorySelect() {
  const { categories, createCategory } = useCategories();
  return (
    <div>
      <select>
        {categories.map(c => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>
      <button onClick={() => void createCategory('Work')}>+ New</button>
    </div>
  );
}
```

### ThemeContext
- Hook: `useTheme()`
- Provider: `ThemeProvider`
- State: `{ theme: 'light' | 'dark' }`
- Methods:
  - `toggleTheme()`

Example:
```tsx
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'}
    </button>
  );
}
```