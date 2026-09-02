'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { assertRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

const roleSchema = z.enum(['super_admin','editor','viewer']);

export async function inviteUser(formData: FormData) {
  const actor = await assertRole(['super_admin']);
  const email = z.string().email().parse(String(formData.get('email') ?? '').toLowerCase());
  const role = roleSchema.parse(formData.get('role'));
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email,{ redirectTo:`${origin}/auth/confirm?next=/admin` });
  if (error || !data.user) throw error ?? new Error('Invitation failed');
  const { error: roleError } = await admin.from('user_roles').upsert({ user_id:data.user.id, role, updated_by:actor.id });
  if (roleError) throw roleError;
  revalidatePath('/admin/users');
}

export async function updateUser(formData: FormData) {
  const actor = await assertRole(['super_admin']);
  const userId = z.string().uuid().parse(formData.get('user_id'));
  const role = roleSchema.parse(formData.get('role'));
  const isActive = formData.get('is_active') === 'true';
  if (userId === actor.id && (!isActive || role !== 'super_admin')) throw new Error('Super Admin tidak dapat menonaktifkan atau menurunkan rolenya sendiri.');
  const supabase = await createClient();
  const [{ error: profileError }, { error: roleError }] = await Promise.all([
    supabase.from('profiles').update({is_active:isActive}).eq('id',userId),
    supabase.from('user_roles').update({role,updated_by:actor.id}).eq('user_id',userId),
  ]);
  if (profileError || roleError) throw profileError ?? roleError;
  revalidatePath('/admin/users');
}

export async function sendPasswordReset(formData: FormData) {
  await assertRole(['super_admin']);
  const email = z.string().email().parse(formData.get('email'));
  const admin = createAdminClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const { error } = await admin.auth.resetPasswordForEmail(email,{redirectTo:`${origin}/auth/confirm?next=/admin`});
  if (error) throw error;
}
