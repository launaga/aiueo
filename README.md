# AIUEO Event Website

Next.js 16 + Supabase CMS untuk website event AIUEO. Website publik tersedia dalam Bahasa Indonesia dan English, dengan dashboard terproteksi untuk konten, media, leads, dan user management.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Tanpa environment Supabase, public site tetap berjalan memakai seed content dan `/admin/login` menampilkan setup notice. Form contact hanya melakukan validasi dalam preview mode.

Dokumentasi lengkap:

- [Setup dan deployment Domainesia](docs/setup.md)
- [Arsitektur dan schema](docs/cms-architecture.md)
- [Panduan mengelola konten](docs/content-guide.md)
- [Requirements inventory dan gap analysis](docs/requirements-gap-analysis.md)
- [Migration Supabase](supabase/migrations/20260902054224_initial_cms_schema.sql)

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

Production/main tidak diubah dari branch fitur. Paket self-hosted dibuat sebagai root aplikasi terpisah untuk subdomain `aiueo.mglwebkits.com`.
