import 'server-only';

import { cookies } from 'next/headers';
import type { AdminIdentity } from '@/lib/auth';
import type { UserRole } from '@/lib/types';
import { hasSupabaseConfig } from '@/lib/supabase/config';

const COOKIE_NAME = 'aiueo_admin_demo';
const SESSION_SECONDS = 60 * 60 * 8;

type DemoSession = { role: Extract<UserRole, 'viewer' | 'super_admin'>; expiresAt: number };

export function isDemoMode() {
  return process.env.ADMIN_DEMO_MODE === 'true' && !hasSupabaseConfig;
}

function demoSecret() {
  const value = process.env.ADMIN_DEMO_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error('ADMIN_DEMO_SESSION_SECRET minimal 32 karakter saat demo mode aktif.');
  }
  return value;
}

function encode(value: string | Uint8Array) {
  return Buffer.from(value).toString('base64url');
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(demoSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return encode(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))));
}

async function verify(value: string, signature: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(demoSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  return crypto.subtle.verify('HMAC', key, Buffer.from(signature, 'base64url'), new TextEncoder().encode(value));
}

export async function createDemoSession(role: DemoSession['role']) {
  if (!isDemoMode()) throw new Error('Demo mode tidak aktif.');
  const payload = encode(JSON.stringify({ role, expiresAt: Date.now() + SESSION_SECONDS * 1000 } satisfies DemoSession));
  const signature = await sign(payload);
  (await cookies()).set(COOKIE_NAME, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
}

export async function clearDemoSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getDemoIdentity(): Promise<AdminIdentity | null> {
  if (!isDemoMode()) return null;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !await verify(payload, signature)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as DemoSession;
    if (session.expiresAt < Date.now() || !['viewer', 'super_admin'].includes(session.role)) return null;
    return session.role === 'viewer'
      ? { id: 'demo-viewer', email: 'viewer@demo.aiueo.local', name: 'Demo Viewer', role: 'viewer', active: true }
      : { id: 'demo-super-admin', email: 'admin@demo.aiueo.local', name: 'Demo Super Admin', role: 'super_admin', active: true };
  } catch {
    return null;
  }
}
