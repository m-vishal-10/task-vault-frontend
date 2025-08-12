## Types

All types are exported from `@/types`.

### Task
```ts
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}
```
Example:
```ts
const task: Task = {
  id: 't1', user_id: 'u1', title: 'Write docs', status: 'in_progress', priority: 'high', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
};
```

### Category
```ts
export interface Category {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
```

### User
```ts
export interface User {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}
```

### AuthState
```ts
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}
```

### Session
```ts
interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}
```