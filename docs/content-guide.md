# Content management guide

## Workflow

1. Login di `/admin/login` menggunakan akun undangan.
2. Pilih Homepage, Services, Events, News, atau Gallery.
3. Buat/edit record. Bahasa Indonesia dan English berada berdampingan.
4. Isi judul, slug, description, body, media URL, dan urutan.
5. Simpan sebagai **Draft**.
6. Gunakan **Preview** untuk memeriksa dua bahasa sebelum publish.
7. Ubah status ke **Published** setelah kedua bahasa lengkap dan QA selesai.

Daftar konten menampilkan indikator kelengkapan translation. Runtime tidak melakukan machine translation; semua copy disimpan secara editorial.

## Slug and SEO

- Gunakan huruf kecil, angka, dan hyphen: `program-private-perusahaan`.
- Slug ID dan EN boleh berbeda.
- Jangan mengubah slug published tanpa menyiapkan redirect, karena akan memutus backlink.
- Title idealnya sekitar 50–60 karakter dan description sekitar 140–160 karakter.
- Pastikan isi benar-benar setara makna, bukan sekadar field terisi.

## Media

Upload dari **Media**. Batas 50 MB dan format yang didukung: JPG, PNG, WebP, GIF, MP4, WebM, QuickTime. Isi alt text ID/EN yang menjelaskan informasi penting pada visual. Video sebaiknya memiliki poster, durasi singkat, dan kompresi web.

Salin public URL media ke field media record konten. Editor dapat upload; penghapusan hanya Super Admin.

## Leads

Lead baru berstatus `new`. Editor/Super Admin dapat memindahkannya ke `contacted`, `qualified`, `closed`, atau `spam`. Viewer hanya dapat membaca. Hindari menyalin data pribadi ke audit notes atau tempat publik.

## Users

Hanya Super Admin dapat mengundang user, mengubah role, mengaktifkan/nonaktifkan akun, dan mengirim reset password. Tidak ada public registration. Super Admin tidak dapat menurunkan role atau menonaktifkan dirinya sendiri melalui dashboard.

## Pre-publish checklist

- ID dan EN lengkap serta setara.
- Slug, title, description, image/video, dan alt text benar.
- Preview desktop dan mobile diperiksa.
- Tautan internal/eksternal berfungsi.
- Event date/time dan venue benar.
- Tidak ada data internal atau pribadi di konten publik.
