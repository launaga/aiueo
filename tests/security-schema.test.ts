import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const migration=readFileSync(join(process.cwd(),'supabase/migrations/20260902054224_initial_cms_schema.sql'),'utf8');
const privacyGate=readFileSync(join(process.cwd(),'supabase/migrations/20260902114334_disable_public_lead_capture.sql'),'utf8');
const tables=['profiles','user_roles','pages','services','events','articles','gallery_items','media_assets','contact_leads','site_settings','audit_logs'];

describe('Supabase authorization schema',()=>{
  it('enables RLS on every exposed application table',()=>tables.forEach(table=>expect(migration).toContain(`alter table public.${table} enable row level security`)));
  it('does not use deprecated auth.role or user metadata for authorization',()=>{expect(migration).not.toContain('auth.role()');expect(migration.match(/raw_user_meta_data/g)).toHaveLength(1)});
  it('separates editor and super-admin permissions',()=>{expect(migration).toContain('private.can_edit_content()');expect(migration).toContain('private.is_super_admin()');expect(migration).toContain('media_storage_delete')});
  it('keeps privileged helpers outside the exposed public schema',()=>{expect(migration).toContain('create schema if not exists private');expect(migration).toContain('revoke all on schema private from public')});
  it('closes anonymous lead storage while the legal/PDP gate is unresolved',()=>{expect(privacyGate).toContain('drop policy if exists leads_public_insert');expect(privacyGate).toContain('revoke insert on public.contact_leads from anon')});
});
