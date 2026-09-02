import type { ContentRecord, ContentResource } from '@/lib/types';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { seedArticles, seedEvents, seedGallery, seedServices } from '@/lib/site-content';

const seeds: Partial<Record<ContentResource, ContentRecord[]>> = { services: seedServices, events: seedEvents, articles: seedArticles, gallery_items: seedGallery };

export async function getPublished(resource: ContentResource): Promise<ContentRecord[]> {
  if (!hasSupabaseConfig) return seeds[resource] ?? [];
  const supabase = await createClient();
  const { data, error } = await supabase.from(resource).select('*').eq('status','published').order('sort_order').limit(100);
  if (error) return seeds[resource] ?? [];
  return (data ?? []) as ContentRecord[];
}

export async function getAdminRows(resource: ContentResource): Promise<ContentRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(resource).select('*').order('updated_at',{ascending:false}).limit(200);
  if (error) throw error;
  return (data ?? []) as ContentRecord[];
}

export async function getPublicCounts() {
  if (!hasSupabaseConfig) return { services: seedServices.length, events: seedEvents.length, articles: seedArticles.length, gallery_items: seedGallery.length };
  const supabase = await createClient();
  const names = ['services','events','articles','gallery_items'] as const;
  const results = await Promise.all(names.map((name)=>supabase.from(name).select('*',{count:'exact',head:true}).eq('status','published')));
  return Object.fromEntries(names.map((name,index)=>[name,results[index].count ?? 0])) as Record<typeof names[number],number>;
}
