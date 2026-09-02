import 'server-only';

import type { ContentRecord, ContentResource } from '@/lib/types';
import { isDemoMode } from '@/lib/demo-auth';
import { createClient } from '@/lib/supabase/server';
import { seedArticles, seedEvents, seedGallery, seedServices } from '@/lib/site-content';

const demoRows: Partial<Record<ContentResource, ContentRecord[]>> = {
  services: seedServices,
  events: seedEvents,
  articles: seedArticles,
  gallery_items: seedGallery,
};

export async function getDashboardData() {
  if (isDemoMode()) return {
    leads: 3,
    activity: [
      { id: 'demo-1', action: 'UPDATE', table_name: 'events', created_at: new Date(Date.now() - 35 * 60_000).toISOString() },
      { id: 'demo-2', action: 'PUBLISH', table_name: 'articles', created_at: new Date(Date.now() - 4 * 60 * 60_000).toISOString() },
      { id: 'demo-3', action: 'UPLOAD', table_name: 'media_assets', created_at: new Date(Date.now() - 24 * 60 * 60_000).toISOString() },
    ],
  };
  const supabase = await createClient();
  const [{ count: leads }, { data: activity }] = await Promise.all([
    supabase.from('contact_leads').select('*', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('id,action,table_name,created_at').order('created_at', { ascending: false }).limit(6),
  ]);
  return { leads: leads ?? 0, activity: activity ?? [] };
}

export async function getAdminContentRows(resource: ContentResource) {
  if (isDemoMode()) return demoRows[resource] ?? [];
  const supabase = await createClient();
  const { data, error } = await supabase.from(resource).select('*').order('updated_at', { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []) as ContentRecord[];
}

export async function getDemoAwareUsers() {
  if (isDemoMode()) return [
    { id: 'demo-super-admin', email: 'admin@demo.aiueo.local', full_name: 'Demo Super Admin', is_active: true, created_at: '2026-08-01T00:00:00.000Z', user_roles: { role: 'super_admin' } },
    { id: 'demo-viewer', email: 'viewer@demo.aiueo.local', full_name: 'Demo Viewer', is_active: true, created_at: '2026-08-15T00:00:00.000Z', user_roles: { role: 'viewer' } },
  ];
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('id,email,full_name,is_active,created_at,user_roles(role)').order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function getDemoAwareMedia() {
  if (isDemoMode()) return [
    { id: 'demo-media-1', file_name: 'team-building.jpg', public_url: '/assets/images/events/team-building.jpg', mime_type: 'image/jpeg', size_bytes: 428_000, alt_id: 'Aktivitas team building AIUEO' },
    { id: 'demo-media-2', file_name: 'rafting.jpg', public_url: '/assets/images/events/rafting.jpg', mime_type: 'image/jpeg', size_bytes: 612_000, alt_id: 'Aktivitas rafting AIUEO' },
  ];
  const supabase = await createClient();
  const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function getDemoAwareLeads() {
  if (isDemoMode()) return [
    { id: 'demo-lead-1', status: 'new', created_at: new Date(Date.now() - 2 * 60 * 60_000).toISOString(), name: 'Nadia Putri', company: 'Nusantara Labs', email: 'nadia@example.test', phone: '+62 812 0000 0000', message: 'Kami merencanakan annual gathering untuk 180 peserta di Jakarta.' },
    { id: 'demo-lead-2', status: 'qualified', created_at: new Date(Date.now() - 26 * 60 * 60_000).toISOString(), name: 'Raka Pratama', company: 'Atma Group', email: 'raka@example.test', phone: '+62 813 0000 0000', message: 'Membutuhkan konsep kick-off interaktif untuk tim regional.' },
  ];
  const supabase = await createClient();
  const { data, error } = await supabase.from('contact_leads').select('*').order('created_at', { ascending: false }).limit(200);
  if (error) throw error;
  return data ?? [];
}
