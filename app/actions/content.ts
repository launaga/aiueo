'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { assertRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { ContentResource } from '@/lib/types';

const allowedResources = ['pages','services','events','articles','gallery_items'] as const;
const contentSchema = z.object({
  resource: z.enum(allowedResources), id: z.string().uuid().optional(), title_id: z.string().min(1), title_en: z.string().min(1),
  slug_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), slug_en: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description_id: z.string().min(1), description_en: z.string().min(1), body_id: z.string(), body_en: z.string(),
  featured_image_url: z.string().max(1000).optional(), status: z.enum(['draft','published']), sort_order: z.coerce.number().int().min(0).max(999),
});

export type ActionResult = { ok: boolean; message: string };

export async function saveContent(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const actor = await assertRole(['super_admin','editor']);
    const parsed = contentSchema.parse(Object.fromEntries(formData));
    const { resource, id, ...record } = parsed;
    const supabase = await createClient();
    const payload: Record<string, unknown> = { ...record, featured_image_url: record.featured_image_url || null, published_at: record.status === 'published' ? new Date().toISOString() : null, updated_by: actor.id };
    if (resource === 'pages' && !id) payload.page_key = record.slug_id;
    const query = id ? supabase.from(resource).update(payload).eq('id',id) : supabase.from(resource).insert({ ...payload, created_by: actor.id });
    const { error } = await query;
    if (error) throw error;
    revalidatePath('/admin'); revalidatePath(`/admin/content/${resource}`); revalidatePath('/id','layout'); revalidatePath('/en','layout');
    return { ok:true, message:'Konten berhasil disimpan.' };
  } catch (error) { return { ok:false, message:error instanceof Error ? error.message : 'Konten gagal disimpan.' }; }
}

export async function deleteContent(resource: ContentResource, id: string) {
  await assertRole(['super_admin']);
  if (!allowedResources.includes(resource)) throw new Error('Resource tidak valid.');
  const supabase = await createClient();
  const { error } = await supabase.from(resource).delete().eq('id',id);
  if (error) throw error;
  revalidatePath(`/admin/content/${resource}`);
}
