# Setup, environment, and preview deployment

## Requirements

- Node.js 20.9+
- Supabase project
- Vercel project `mgl-portfolio/aiueo`
- Git branch selain `main` selama development dan QA

## Sandbox demo tanpa Supabase

Sandbox hanya aktif jika Supabase tidak dikonfigurasi dan flag server-side diaktifkan. Tidak ada public registration, password demo, data production, atau service-role key di browser. Dua tombol persona pada `/admin/login` membuat session cookie `httpOnly` bertanda tangan selama 8 jam.

```bash
export ADMIN_DEMO_MODE=true
export ADMIN_DEMO_SESSION_SECRET="$(openssl rand -base64 32)"
npm run dev
```

Pilih **Masuk sebagai Viewer** untuk dashboard read-only atau **Masuk sebagai Super Admin** untuk melihat navigasi penuh termasuk User management. Mutasi eksternal seperti email invitation, upload, perubahan lead, dan password sengaja disabled/no-op di sandbox. Jangan menyimpan nilai `ADMIN_DEMO_SESSION_SECRET` ke repository; pasang sebagai encrypted environment variable untuk Vercel Preview bila demo preview dibutuhkan.

Untuk kembali ke Supabase asli, hapus/nonaktifkan `ADMIN_DEMO_MODE` lalu isi variable Supabase di bawah. Bila variable Supabase tersedia, sandbox otomatis tidak aktif.

## Supabase

1. Buat atau pilih project Supabase.
2. Pastikan **Allow new users to sign up** dimatikan pada Auth settings. Dashboard ini tidak memiliki public registration.
3. Atur Site URL dan allowed redirect URLs:
   - Local: `http://localhost:3000/auth/confirm`
   - Preview: `https://<preview-domain>/auth/confirm`
   - Production baru ditambahkan setelah QA disetujui.
4. Link CLI lalu terapkan migration:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

5. Buat user pertama melalui Supabase Auth dashboard. Trigger migration otomatis membuat `profiles` dan role `viewer`. Bootstrap role pertama melalui SQL Editor:

```sql
update public.user_roles
set role = 'super_admin'
where user_id = (select id from auth.users where email = 'YOUR_ADMIN_EMAIL');
```

Setelah itu, semua user berikutnya harus ditambahkan lewat **Admin → Users → Undang user**.

## Environment variables

Salin `.env.example` ke `.env.local`. Jangan commit file `.env*` atau secret key.

| Variable | Exposure | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser + server | Publishable client key; access tetap dibatasi RLS |
| `SUPABASE_SECRET_KEY` | Server only | Invite user dan Auth admin operations |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical URL dan redirect email |
| `ADMIN_DEMO_MODE` | Server only | Mengaktifkan sandbox saat Supabase tidak tersedia |
| `ADMIN_DEMO_SESSION_SECRET` | Server only | Menandatangani cookie sandbox; minimal 32 karakter |

`SUPABASE_SECRET_KEY` tidak pernah memakai prefix `NEXT_PUBLIC_`. Jangan menggunakan atau membundel legacy service-role key di browser.

## Vercel preview

Tambahkan variable di atas untuk environment **Preview**. Gunakan domain preview yang diberikan Vercel untuk `NEXT_PUBLIC_SITE_URL`, lalu tambahkan URL callback tersebut ke Supabase Auth. Deployment yang aman:

```bash
git push -u origin codex/admin-cms-bilingual
vercel deploy
```

Jangan gunakan `vercel --prod` dan jangan merge ke `main` sebelum checklist QA selesai.

## Auth email

Invitation dan reset password kembali melalui `/auth/confirm`, menukar token/code menjadi session cookie, lalu mengarah ke dashboard. User dapat mengganti password dari **Admin → Akun**. Untuk production, konfigurasikan custom SMTP dan template email Supabase agar sender, expiry, serta redirect domain sesuai brand.

## Recovery

Website lama tetap tersedia pada histori Git. URL `.html` diarahkan permanen ke URL `/id/...`, sehingga backlink tidak putus. Jika Supabase belum tersedia, public rendering memakai seed lokal; admin dan persistence sengaja tidak aktif.
