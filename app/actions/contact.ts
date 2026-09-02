'use server';

import { z } from 'zod';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';

const leadSchema = z.object({ name:z.string().min(2).max(120), email:z.string().email().max(200), phone:z.string().max(40).optional(), company:z.string().max(160).optional(), message:z.string().min(10).max(4000), locale:z.enum(['id','en']), website:z.string().max(0).optional() });
export type LeadState = { ok:boolean; message:string };

export async function submitLead(_: LeadState, formData: FormData): Promise<LeadState> {
  try {
    const input = leadSchema.parse(Object.fromEntries(formData));
    if (!hasSupabaseConfig) return { ok:true, message:input.locale === 'id' ? 'Mode preview: formulir tervalidasi, tetapi belum dikirim.' : 'Preview mode: form validated but was not sent.' };
    const supabase = await createClient();
    const { error } = await supabase.from('contact_leads').insert({ name:input.name,email:input.email,phone:input.phone||null,company:input.company||null,message:input.message,locale:input.locale });
    if (error) throw error;
    return { ok:true, message:input.locale === 'id' ? 'Terima kasih. Tim kami akan segera menghubungi Anda.' : 'Thank you. Our team will be in touch shortly.' };
  } catch { return { ok:false, message:'Mohon periksa kembali data formulir.' }; }
}
