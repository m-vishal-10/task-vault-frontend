## Components

All components are client components and can be imported from `@/components/*`.

### Header
- Props: none
- Description: Fixed top bar showing app title and user info with a Sign Out action.
- Usage:
```tsx
import Header from '@/components/Header';

export default function Page() {
  return <Header />;
}
```

### TaskList
- Props: none
- Description: Renders the list of tasks using filtered state from `TaskContext`.
- Usage:
```tsx
import TaskList from '@/components/TaskList';

export default function Page() {
  return <TaskList />;
}
```

### TaskItem
- Props:
  - `task: Task`
  - `onUpdate(id: string, updates: Partial<Task>)`
  - `onDelete(id: string)`
- Usage:
```tsx
import TaskItem from '@/components/TaskItem';
import type { Task } from '@/types';

const sample: Task = {
  id: '1', user_id: 'u', title: 'Demo', status: 'pending', priority: 'medium', created_at: '', updated_at: ''
};

<TaskItem
  task={sample}
  onUpdate={(id, updates) => console.log(id, updates)}
  onDelete={(id) => console.log('delete', id)}
/>
```

### TaskForm
- Props:
  - `onClose: () => void` (required)
  - `onSuccess?: () => void`
- Description: Modal form to create a task; integrates with categories.
- Usage:
```tsx
import TaskForm from '@/components/TaskForm';

<TaskForm onClose={() => setOpen(false)} onSuccess={() => alert('Created!')} />
```

### Stats
- Props: none
- Description: Summary cards (total, active, completed, completion rate).

### SearchFilter
- Props:
  - `currentFilter?: 'all' | 'active' | 'completed'`
  - `onFilterChange?: (filter: string) => void`
- Description: Search input, category dropdown, and status filter chips. Uses `TaskContext` if props are omitted.
- Usage:
```tsx
import SearchFilter from '@/components/SearchFilter';

<SearchFilter />
```

### QuickActions
- Props:
  - `onAddTaskClick: () => void`
  - `onViewAll?: () => void`
  - `onViewCompleted?: () => void`
- Usage:
```tsx
import QuickActions from '@/components/QuickActions';

<QuickActions
  onAddTaskClick={() => setOpen(true)}
  onViewAll={() => setFilter('all')}
  onViewCompleted={() => setFilter('completed')}
/>
```

### Breadcrumb
- Props:
  - `items?: Array<{ label: string; href?: string; current?: boolean }>`
- Usage:
```tsx
import Breadcrumb from '@/components/Breadcrumb';

<Breadcrumb items=[
  { label: 'Home', href: '/' },
  { label: 'Tasks', current: true },
] />
```

### ThemeToggle
- Props: none
- Description: Button that toggles the current theme using `ThemeContext`.

### Sidebar
- Props:
  - `isOpen: boolean`
  - `onToggle: () => void`
  - `collapsed: boolean`
  - Note: The current implementation does not accept an `onCollapseToggle` prop, even though it appears in an internal interface.
- Usage:
```tsx
import Sidebar from '@/components/Sidebar';

<Sidebar isOpen={isOpen} onToggle={() => setOpen(o => !o)} collapsed={false} />
```