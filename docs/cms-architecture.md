# CMS architecture and security model

## Runtime

- Next.js App Router dan React Server Components untuk read paths.
- Server Actions untuk login, CRUD, leads, user management, password, dan media.
- Supabase Auth memakai cookie SSR; session di-refresh pada `proxy.ts` dan divalidasi lagi dengan `getUser()` di server.
- PostgreSQL adalah source of truth. Supabase Storage bucket `media` menyimpan image/video.
- Runtime deployment berupa Next.js standalone di Node.js App/Passenger Domainesia. Supabase tetap menangani CMS/Auth/Storage.

## Tables

| Table | Purpose |
|---|---|
| `profiles` | Nama, email mirror, status akun aktif |
| `user_roles` | Satu role otorisasi per user |
| `pages` | Homepage dan page-level copy ID/EN |
| `services` | Delapan layanan dan detail |
| `events` | Event, jadwal, venue, publish state |
| `articles` | News/articles |
| `gallery_items` | Image/video gallery records |
| `media_assets` | Metadata file Storage dan alt text bilingual |
| `contact_leads` | Public brief inbox dan workflow status |
| `site_settings` | Contact/SEO settings berbentuk JSON |
| `audit_logs` | Actor, action, table, before/after, timestamp |

Content tables memakai `created_at`, `updated_at`, `created_by`, `updated_by`, `status`, `published_at`, `sort_order`, dan field bilingual `*_id` / `*_en`. Slug ID dan EN unik secara terpisah.

## Authorization matrix

| Capability | Super Admin | Editor | Viewer | Public |
|---|:---:|:---:|:---:|:---:|
| View dashboard/drafts/leads/audit | ✓ | ✓ | ✓ | — |
| Create/update content | ✓ | ✓ | — | — |
| Upload/update media metadata | ✓ | ✓ | — | — |
| Delete content/media | ✓ | — | — | — |
| Update lead status | ✓ | ✓ | — | — |
| Invite/role/activate users | ✓ | — | — | — |
| Read published content/media | ✓ | ✓ | ✓ | ✓ |
| Submit contact lead | ✓ | ✓ | ✓ | ✓ |

UI gating hanya untuk experience; setiap mutasi memanggil authorization server-side dan database menjalankan RLS lagi. Role dibaca dari `user_roles`, bukan `raw_user_meta_data`. Helper otorisasi berada di schema `private`, dengan execute privilege minimum.

## Account deactivation

`profiles.is_active=false` membuat helper role mengembalikan tidak ada akses. Route server juga menolak identity nonaktif. Karena access token yang sudah terbit tidak otomatis hilang saat user dinonaktifkan, JWT expiry perlu dibuat pendek untuk kebutuhan berisiko tinggi; session aktif tetap tidak dapat membaca row karena RLS mengecek status akun.

## Audit

Trigger mencatat insert/update/delete penting dengan `auth.uid()`, nama tabel, record id, old/new JSON, dan `created_at`. `audit_logs` hanya dapat dibaca oleh role dashboard dan tidak dapat ditulis langsung oleh client.

## Public routes and SEO

- Default `/` memilih cookie terakhir, lalu browser English, selain itu Bahasa Indonesia.
- URL publik: `/id/...` dan `/en/...`.
- URL legacy `/*.html` redirect ke `/id/...`.
- Metadata mencakup canonical, `id-ID`, `en-US`, `x-default`, Open Graph, per-page `lang`, sitemap, robots, dan JSON-LD.
- Draft tidak pernah lolos policy public. Preview draft berada di route admin terproteksi.
