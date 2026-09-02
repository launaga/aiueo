create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public;

create type public.app_role as enum ('super_admin','editor','viewer');
create type public.publish_status as enum ('draft','published');
create type public.lead_status as enum ('new','contacted','qualified','closed','spam');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role public.app_role not null default 'viewer',
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(), page_key text not null unique,
  slug_id text not null unique, slug_en text not null unique,
  title_id text not null, title_en text not null, description_id text not null, description_en text not null,
  body_id text not null default '', body_en text not null default '', featured_image_url text,
  status public.publish_status not null default 'draft', sort_order integer not null default 0,
  published_at timestamptz, created_by uuid references auth.users(id) on delete set null, updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(), slug_id text not null unique, slug_en text not null unique,
  title_id text not null, title_en text not null, description_id text not null, description_en text not null,
  body_id text not null default '', body_en text not null default '', featured_image_url text,
  status public.publish_status not null default 'draft', sort_order integer not null default 0,
  published_at timestamptz, created_by uuid references auth.users(id) on delete set null, updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(), slug_id text not null unique, slug_en text not null unique,
  title_id text not null, title_en text not null, description_id text not null, description_en text not null,
  body_id text not null default '', body_en text not null default '', featured_image_url text,
  starts_at timestamptz, ends_at timestamptz, venue_id text, venue_en text,
  status public.publish_status not null default 'draft', sort_order integer not null default 0,
  published_at timestamptz, created_by uuid references auth.users(id) on delete set null, updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint event_date_order check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(), slug_id text not null unique, slug_en text not null unique,
  title_id text not null, title_en text not null, description_id text not null, description_en text not null,
  body_id text not null default '', body_en text not null default '', featured_image_url text,
  status public.publish_status not null default 'draft', sort_order integer not null default 0,
  published_at timestamptz, created_by uuid references auth.users(id) on delete set null, updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(), slug_id text not null unique, slug_en text not null unique,
  title_id text not null, title_en text not null, description_id text not null, description_en text not null,
  body_id text not null default '', body_en text not null default '', featured_image_url text,
  media_type text not null default 'image' check (media_type in ('image','video')),
  status public.publish_status not null default 'draft', sort_order integer not null default 0,
  published_at timestamptz, created_by uuid references auth.users(id) on delete set null, updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(), file_name text not null, storage_path text not null unique,
  public_url text not null, mime_type text not null, size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  alt_id text not null default '', alt_en text not null default '', uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.contact_leads (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text, company text,
  message text not null, locale text not null default 'id' check (locale in ('id','en')), status public.lead_status not null default 'new',
  assigned_to uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(), setting_key text not null unique, value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key, actor_id uuid references auth.users(id) on delete set null,
  action text not null, table_name text not null, record_id text, old_data jsonb, new_data jsonb,
  created_at timestamptz not null default now()
);

create index services_public_order_idx on public.services (sort_order, published_at desc) where status = 'published';
create index events_public_order_idx on public.events (sort_order, starts_at) where status = 'published';
create index articles_public_order_idx on public.articles (sort_order, published_at desc) where status = 'published';
create index gallery_public_order_idx on public.gallery_items (sort_order, published_at desc) where status = 'published';
create index leads_status_created_idx on public.contact_leads (status, created_at desc);
create index audit_created_idx on public.audit_logs (created_at desc);

create function private.current_user_active() returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select p.is_active from public.profiles p where p.id = (select auth.uid())), false)
$$;
create function private.current_user_role() returns public.app_role language sql stable security definer set search_path = '' as $$
  select r.role from public.user_roles r where r.user_id = (select auth.uid()) and private.current_user_active()
$$;
create function private.can_view_dashboard() returns boolean language sql stable security definer set search_path = '' as $$
  select private.current_user_role() in ('super_admin','editor','viewer')
$$;
create function private.can_edit_content() returns boolean language sql stable security definer set search_path = '' as $$
  select private.current_user_role() in ('super_admin','editor')
$$;
create function private.is_super_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select private.current_user_role() = 'super_admin'
$$;
revoke all on all functions in schema private from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.current_user_active(), private.current_user_role(), private.can_view_dashboard(), private.can_edit_content(), private.is_super_admin() to authenticated;
grant execute on function private.can_view_dashboard() to anon;

create function private.set_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;
create function private.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,email,full_name) values(new.id,coalesce(new.email,''),new.raw_user_meta_data->>'full_name') on conflict(id) do nothing;
  insert into public.user_roles(user_id,role) values(new.id,'viewer') on conflict(user_id) do nothing;
  return new;
end $$;
create function private.write_audit_log() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_logs(actor_id,action,table_name,record_id,old_data,new_data)
  values((select auth.uid()),tg_op,tg_table_name,coalesce(to_jsonb(new)->>'id',to_jsonb(new)->>'user_id',to_jsonb(old)->>'id',to_jsonb(old)->>'user_id'),case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end);
  if tg_op = 'DELETE' then return old; else return new; end if;
end $$;
revoke all on function private.handle_new_user(), private.write_audit_log(), private.set_updated_at() from public, anon, authenticated;

create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();
do $$ declare t text; begin foreach t in array array['profiles','user_roles','pages','services','events','articles','gallery_items','media_assets','contact_leads','site_settings'] loop execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function private.set_updated_at()',t,t); end loop; end $$;
do $$ declare t text; begin foreach t in array array['user_roles','pages','services','events','articles','gallery_items','media_assets','contact_leads','site_settings'] loop execute format('create trigger audit_%I after insert or update or delete on public.%I for each row execute function private.write_audit_log()',t,t); end loop; end $$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.pages enable row level security;
alter table public.services enable row level security;
alter table public.events enable row level security;
alter table public.articles enable row level security;
alter table public.gallery_items enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_leads enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_read on public.profiles for select to authenticated using (id=(select auth.uid()) or private.is_super_admin());
create policy profiles_super_update on public.profiles for update to authenticated using (private.is_super_admin()) with check (private.is_super_admin());
create policy roles_read on public.user_roles for select to authenticated using (user_id=(select auth.uid()) or private.is_super_admin());
create policy roles_super_write on public.user_roles for all to authenticated using (private.is_super_admin()) with check (private.is_super_admin());

do $$ declare t text; begin foreach t in array array['pages','services','events','articles','gallery_items'] loop
  execute format('create policy %I_public_read on public.%I for select to anon, authenticated using (status = ''published'' or private.can_view_dashboard())',t,t);
  execute format('create policy %I_editor_insert on public.%I for insert to authenticated with check (private.can_edit_content())',t,t);
  execute format('create policy %I_editor_update on public.%I for update to authenticated using (private.can_edit_content()) with check (private.can_edit_content())',t,t);
  execute format('create policy %I_super_delete on public.%I for delete to authenticated using (private.is_super_admin())',t,t);
end loop; end $$;

create policy media_public_read on public.media_assets for select to anon, authenticated using (true);
create policy media_editor_insert on public.media_assets for insert to authenticated with check (private.can_edit_content());
create policy media_editor_update on public.media_assets for update to authenticated using (private.can_edit_content()) with check (private.can_edit_content());
create policy media_super_delete on public.media_assets for delete to authenticated using (private.is_super_admin());
create policy leads_public_insert on public.contact_leads for insert to anon, authenticated with check (status='new' and assigned_to is null);
create policy leads_admin_read on public.contact_leads for select to authenticated using (private.can_view_dashboard());
create policy leads_editor_update on public.contact_leads for update to authenticated using (private.can_edit_content()) with check (private.can_edit_content());
create policy leads_super_delete on public.contact_leads for delete to authenticated using (private.is_super_admin());
create policy settings_public_read on public.site_settings for select to anon, authenticated using (true);
create policy settings_editor_insert on public.site_settings for insert to authenticated with check (private.can_edit_content());
create policy settings_editor_update on public.site_settings for update to authenticated using (private.can_edit_content()) with check (private.can_edit_content());
create policy settings_super_delete on public.site_settings for delete to authenticated using (private.is_super_admin());
create policy audit_admin_read on public.audit_logs for select to authenticated using (private.can_view_dashboard());

grant select on public.pages,public.services,public.events,public.articles,public.gallery_items,public.media_assets,public.site_settings to anon;
grant insert on public.contact_leads to anon;
grant select,insert,update,delete on all tables in schema public to authenticated;
grant usage,select on all sequences in schema public to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('media','media',true,52428800,array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']) on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy media_storage_read on storage.objects for select to anon, authenticated using (bucket_id='media');
create policy media_storage_insert on storage.objects for insert to authenticated with check (bucket_id='media' and private.can_edit_content());
create policy media_storage_update on storage.objects for update to authenticated using (bucket_id='media' and private.can_edit_content()) with check (bucket_id='media' and private.can_edit_content());
create policy media_storage_delete on storage.objects for delete to authenticated using (bucket_id='media' and private.is_super_admin());

insert into public.pages(page_key,slug_id,slug_en,title_id,title_en,description_id,description_en,status,sort_order,published_at) values
('home','home','home','Hidup penuh momen. Buat jadi berkesan.','Life is an event. Make it live.','Kami mengubah momen perusahaan menjadi cerita bersama yang layak dikenang.','We turn company moments into shared stories people actually want to remember.','published',0,now()),
('about','about','about','Bukan sekadar event organizer.','Not just an event organizer.','Kami mendengar, merancang ritme, mengelola kerumitan, dan menjaga alasan orang berkumpul.','We listen, design the rhythm, manage the chaos, and protect the reason people came together.','published',1,now()),
('services','services','services','Apa yang bisa kita hidupkan?','What can we make live?','Pilih titik awal. Kami akan membuatnya terasa milik Anda.','Choose a starting point. We’ll make it yours.','published',2,now()),
('events','events','events','Agenda yang benar-benar terjadi.','What’s coming up.','Hanya tanggal yang sudah dikonfirmasi yang kami tampilkan.','Only confirmed dates go live.','published',3,now()),
('news','news','news','Catatan dari lapangan.','Fresh from the field.','Ide dan pelajaran tentang pengalaman perusahaan.','Ideas and lessons about company experiences.','published',4,now()),
('gallery','gallery','gallery','Bukti bahwa ini terjadi.','Proof that it happened.','Momen nyata dan orang-orang yang hadir sepenuhnya.','Real moments and people fully present.','published',5,now()),
('contact','contact','contact','Mulai dari alasan untuk berkumpul.','Start with the reason to gather.','Kami akan membantu membentuk langkah berikutnya.','We’ll help shape the next step.','published',6,now());

insert into public.services(slug_id,slug_en,title_id,title_en,description_id,description_en,body_id,body_en,featured_image_url,status,sort_order,published_at) values
('corporate-event','corporate-event','Corporate Event','Corporate Event','Acara perusahaan dengan konsep tajam, produksi mulus, dan energi yang hidup.','A sharp concept, seamless production, and a room that feels fully switched on.','Dari konsep hingga evaluasi, setiap detail menjaga tujuan acara.','From concept through evaluation, every detail protects the event purpose.','/assets/images/events/corporate-event.jpg','published',0,now()),
('annual-kick-off','annual-kick-off','Annual Kick Off','Annual Kick Off','Satukan arah, energi, dan ambisi tahun baru.','Turn the year’s ambition into direction, energy, and momentum.','Tema, narasi, panggung, dan partisipasi dalam satu ritme.','Theme, narrative, stage, and participation in one rhythm.','/assets/images/events/annual-kickoff.jpg','published',1,now()),
('employee-gathering','employee-gathering','Employee Gathering','Employee Gathering','Ruang untuk tim terhubung, merayakan, dan menikmati kebersamaan.','A day where teams connect, celebrate, and enjoy being together.','Kami merancang pengalaman untuk manusia di balik pekerjaan.','We design an experience for the people behind the work.','/assets/images/events/employee-gathering.jpg','published',2,now()),
('family-gathering','family-gathering','Family Gathering','Family Gathering','Pengalaman inklusif bagi kolega, pasangan, anak, dan setiap generasi.','An inclusive experience for colleagues, partners, children, and every generation.','Aktivitas, hiburan, keamanan, dan kenyamanan dirancang bersama.','Activities, entertainment, safety, and comfort are planned together.','/assets/images/events/family-gathering.jpg','published',3,now()),
('outing-outbound','outing-outbound','Outing & Outbound','Outing & Outbound','Keluar dari rutinitas untuk bergerak, tertawa, dan menjelajah.','Step out of routine to move, laugh, and explore.','Destinasi, transportasi, program, konsumsi, dan mitigasi risiko.','Destination, transport, program, meals, and risk management.','/assets/images/events/outing-beach.jpg','published',4,now()),
('team-building','team-building','Team Building','Team Building','Aktivitas bermakna dari dinamika nyata tim Anda.','Purposeful challenges shaped by your team’s real dynamics.','Pemetaan kebutuhan, modul khusus, fasilitasi, dan refleksi.','Needs mapping, custom modules, facilitation, and reflection.','/assets/images/events/team-building.jpg','published',5,now()),
('company-anniversary','company-anniversary','Company Anniversary','Company Anniversary','Rayakan perjalanan dengan sejarah, pertunjukan, dan momentum baru.','Honor the journey with history, spectacle, and forward momentum.','Kisah milestone, penghargaan, produksi, dan dokumentasi.','Milestone story, recognition, production, and documentation.','/assets/images/events/company-anniversary.jpg','published',6,now()),
('custom-event-management','custom-event-management','Manajemen Event Khusus','Custom Event Management','Kami membangun format yang tepat untuk tujuan unik Anda.','We build the right format around your unique purpose.','Konsultasi, konsep khusus, produksi menyeluruh, dan evaluasi.','Consultation, bespoke concept, full production, and evaluation.','/assets/images/events/custom-event.jpg','published',7,now());

insert into public.articles(slug_id,slug_en,title_id,title_en,description_id,description_en,body_id,body_en,featured_image_url,status,published_at) values('kick-off-butuh-cerita','your-kick-off-needs-a-story','Kick off Anda butuh cerita, bukan sekadar rundown.','Your annual kick off needs a plot, not another rundown.','Energi yang baik dirancang. Inilah titik mulainya.','Good energy is designed. Here’s where it starts.','Acara kuat memiliki alasan hadir, partisipasi, dan penutup yang menggerakkan.','Strong events have a reason to show up, participation, and a closing moment that moves people.','/assets/images/events/annual-kickoff.jpg','published',now());
insert into public.events(slug_id,slug_en,title_id,title_en,description_id,description_en,body_id,body_en,featured_image_url,status,published_at) values('program-private-perusahaan','private-company-programs','Program privat untuk perusahaan','Private programs for companies','Tanggal publik tampil setelah dikonfirmasi. Hubungi kami untuk program privat.','Public dates appear once confirmed. Talk to us about a private program.','Program dirancang sesuai tujuan, peserta, waktu, dan lokasi.','Programs are shaped around your goals, guests, timing, and location.','/assets/images/events/water-activity.jpg','published',now());
insert into public.gallery_items(slug_id,slug_en,title_id,title_en,description_id,description_en,featured_image_url,status,sort_order,published_at) values
('rafting','rafting','Arus, fokus, dan kerja tim','Current, focus, and teamwork','Persiapan aktivitas rafting.','Preparing for a rafting activity.','/assets/images/events/rafting.jpg','published',0,now()),
('malam-kebersamaan','shared-evening','Malam kebersamaan','A shared evening','Cerita dimulai setelah agenda selesai.','The stories begin after the agenda.','/assets/images/events/company-anniversary.jpg','published',1,now()),
('briefing-tim','team-briefing','Briefing sebelum bergerak','Briefing before the team moves','Fasilitator menyiapkan ritme aktivitas.','A facilitator sets the rhythm for the activity.','/assets/images/events/team-building.jpg','published',2,now());

insert into public.site_settings(setting_key,value) values('contact','{"phone":"+6289674002822","whatsapp":"6289674002822","city":"Jakarta"}'::jsonb),('seo','{"site_name":"AIUEO","default_locale":"id"}'::jsonb);
