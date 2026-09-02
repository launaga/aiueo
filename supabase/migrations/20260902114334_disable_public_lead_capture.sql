-- Fase 0 legal gate: the public brief is composed locally and handed to WhatsApp.
-- Keep historical leads readable to authorized dashboard users, but do not allow
-- anonymous/authenticated public inserts until AIUEO has approved PDP processing,
-- retention, and a named system of record.
drop policy if exists leads_public_insert on public.contact_leads;
revoke insert on public.contact_leads from anon;
revoke insert on public.contact_leads from authenticated;

comment on table public.contact_leads is
  'Historical lead inbox. Public inserts disabled pending legal/PDP gate; current website uses a non-persistent WhatsApp handoff.';
