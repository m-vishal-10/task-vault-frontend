## API Service (`apiService`)

Thin HTTP client used by contexts and components. Base URL: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001/api`).

Import:
```ts
import { apiService } from '@/services/api';
```

### Authentication
- `signup(email: string, password: string)` → `Promise<{ user, session, message?, requiresEmailConfirmation? }>`
- `signin(email: string, password: string)` → `Promise<{ user, session }>`
- `signout()` → `Promise<void>`
- `getCurrentUser()` → `Promise<{ user }>`
- `refreshSession(refreshToken: string)` → `Promise<{ session }>`
- `forgotPassword(email: string)` → `Promise<{ message: string }>`
- `resetPassword(accessToken: string, refreshToken: string, newPassword: string)` → `Promise<{ access_token, refresh_token }>`

Example:
```ts
const { user, session } = await apiService.signin('me@example.com', 'Secret123');
```

### Tasks
- `getTasks()` → `Promise<{ tasks: Task[] }>`
- `getTask(id: string)` → `Promise<{ task: Task }>`
- `createTask(taskData)` → `Promise<{ task: Task }>`
- `updateTask(id: string, updates)` → `Promise<{ task: Task }>`
- `deleteTask(id: string)` → `Promise<void>`
- `getTasksByStatus(status: string)` → `Promise<{ tasks: Task[] }>`
- `getTasksByPriority(priority: string)` → `Promise<{ tasks: Task[] }>`

Example:
```ts
await apiService.createTask({ title: 'Ship docs', priority: 'high' });
```

### Categories
- `getCategories()` → `Promise<{ categories: Category[] }>`
- `createCategory({ name: string })` → `Promise<{ category: Category }>`
- `getTasksByCategory(category: string)` → `Promise<{ tasks: Task[] }>`

### Utilities
- `isAuthenticated()` → `boolean`
- `getAccessToken()` → `string | null`
- `getRefreshToken()` → `string | null`

### Error handling
- Non-OK responses throw `Error`. A 401 clears local tokens and navigates to `/login`.