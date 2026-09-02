import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { publicConfig } from './config';

export async function createClient() {
  const { url, key } = publicConfig();
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Server Components cannot write cookies; proxy refreshes them. */ }
      },
    },
  });
}
