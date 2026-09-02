'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { assertRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function updateLeadStatus(formData:FormData){await assertRole(['super_admin','editor']);const id=z.string().uuid().parse(formData.get('id'));const status=z.enum(['new','contacted','qualified','closed','spam']).parse(formData.get('status'));const supabase=await createClient();const {error}=await supabase.from('contact_leads').update({status}).eq('id',id);if(error)throw error;revalidatePath('/admin/leads')}
