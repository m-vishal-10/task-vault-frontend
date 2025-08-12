## Utilities and Configuration

### Supabase Client
The app initializes a Supabase client for password recovery flows.

```ts
// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Usage example (inline password recovery):
```tsx
import { supabase } from '@/utils/supabaseClient';

await supabase.auth.setSession({ access_token, refresh_token });
await supabase.auth.updateUser({ password: newPassword });
```

### Environment variables
Set the following variables in your environment (e.g., `.env.local`):

- `NEXT_PUBLIC_API_URL` — Base URL for the backend API (e.g., `http://localhost:3001/api`)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key

Restart the dev server after changes.