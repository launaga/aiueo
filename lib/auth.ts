import { cache } from 'react';
import { redirect } from 'next/navigation';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/lib/types';
import { getDemoIdentity, isDemoMode } from '@/lib/demo-auth';

export type AdminIdentity = { id: string; email: string; name: string; role: UserRole; active: boolean };

export const getAdminIdentity = cache(async (): Promise<AdminIdentity | null> => {
  if (isDemoMode()) return getDemoIdentity();
  if (!hasSupabaseConfig) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: role }] = await Promise.all([
    supabase.from('profiles').select('full_name,is_active').eq('id', user.id).maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle(),
  ]);
  if (!profile?.is_active || !role?.role) return null;
  return { id: user.id, email: user.email ?? '', name: profile.full_name || user.email || 'User', role: role.role as UserRole, active: true };
});

export async function requireAdmin(allowed: UserRole[] = ['super_admin','editor','viewer']) {
  const identity = await getAdminIdentity();
  if (!identity) redirect('/admin/login');
  if (!allowed.includes(identity.role)) redirect('/admin?denied=1');
  return identity;
}

export async function assertRole(allowed: UserRole[]) {
  const identity = await getAdminIdentity();
  if (!identity || !allowed.includes(identity.role)) throw new Error('Anda tidak memiliki izin untuk tindakan ini.');
  return identity;
}
