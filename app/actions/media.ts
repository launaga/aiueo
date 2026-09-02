'use server';

import { revalidatePath } from 'next/cache';
import { assertRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const allowed = new Set(['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']);
export async function uploadMedia(formData: FormData) {
  const actor = await assertRole(['super_admin','editor']);
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) throw new Error('Pilih file.');
  if (!allowed.has(file.type) || file.size > 50 * 1024 * 1024) throw new Error('File harus berupa image/video dan maksimal 50 MB.');
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g,'-');
  const path = `${new Date().getUTCFullYear()}/${crypto.randomUUID()}-${safeName}`;
  const supabase = await createClient();
  const { error } = await supabase.storage.from('media').upload(path,file,{contentType:file.type,upsert:false});
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  const { error: recordError } = await supabase.from('media_assets').insert({file_name:file.name,storage_path:path,public_url:data.publicUrl,mime_type:file.type,size_bytes:file.size,uploaded_by:actor.id,alt_id:String(formData.get('alt_id')??''),alt_en:String(formData.get('alt_en')??'')});
  if (recordError) throw recordError;
  revalidatePath('/admin/media');
}
