'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { clearDemoSession, createDemoSession, isDemoMode } from '@/lib/demo-auth';
import { hasSupabaseConfig } from '@/lib/supabase/config';

export async function demoLoginAction(formData: FormData) {
  if (!isDemoMode() || hasSupabaseConfig) redirect('/admin/login?error=Demo mode tidak tersedia.');
  const role = String(formData.get('role') ?? '');
  if (role !== 'viewer' && role !== 'super_admin') redirect('/admin/login?error=Role demo tidak valid.');
  await createDemoSession(role);
  redirect('/admin');
}

export async function loginAction(formData: FormData) {
  if (!hasSupabaseConfig) redirect('/admin/login?error=Supabase belum dikonfigurasi.');
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/admin/login?error=${encodeURIComponent('Email atau password tidak valid.')}`);
  redirect('/admin');
}

export async function logoutAction() {
  if (isDemoMode()) {
    await clearDemoSession();
    redirect('/admin/login');
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function resetPasswordAction(formData: FormData) {
  if (!hasSupabaseConfig) redirect('/admin/login?error=Supabase belum dikonfigurasi.');
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/confirm?next=/admin` });
  redirect('/admin/login?message=Periksa email untuk tautan reset password.');
}

export async function updatePasswordAction(formData: FormData) {
  if (isDemoMode()) redirect('/admin/account?error=Password tidak dapat diubah di sandbox demo.');
  const password = String(formData.get('password') ?? '');
  if (password.length < 10) redirect('/admin/account?error=Password minimal 10 karakter.');
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect(`/admin/account?error=${encodeURIComponent(error.message)}`);
  redirect('/admin/account?message=Password berhasil diperbarui.');
}
