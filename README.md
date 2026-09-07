# Nalar — AI Learning Companion (frontend)

Nalar adalah antarmuka frontend berbasis Next.js (App Router) dan TypeScript untuk sebuah learning companion/landing site. Repo ini berisi aplikasi Next.js yang menampilkan UI dan komponen untuk proyek "Nalar" — logika backend/AI terpisah (jika ada) tidak termasuk di sini.

## Stack
- Language(s): TypeScript, JavaScript, HTML, CSS
- Framework / runtime: Next.js (App Router) + React 19
- Notable libraries: framer-motion, lucide-react, clsx, tailwindcss

## Struktur penting
```
src/
  app/
    page.tsx        # Entry page / konten utama
    layout.tsx      # Layout global
    globals.css     # Styling global (Tailwind + custom)
    favicon.ico
  components/
    Header.tsx
    Sidebar.tsx
    MobileNav.tsx
    ui/             # komponen UI/hero/etc.
  lib/
    utils.ts        # utilitas kecil
public/             # aset publik (gambar, favicon, dll)
Referensi_Nalar/     # referensi dan materi terkait (non-UI)
AGENTS.md            # file yang dihasilkan/ditambahkan oleh next dev
package.json         # scripts & dependencies
```

Bagian utama aplikasi ada di `src/app/page.tsx` dan komponen UI di `src/components/`. Bila ingin mengubah tampilan utama, mulai dari `page.tsx` dan komponen di `src/components/`.

## Menjalankan secara lokal
1. Install dependency:
```bash
npm install
# atau
pnpm install
# atau
yarn
```

2. Jalankan server dev:
```bash
npm run dev
# atau
pnpm dev
# atau
yarn dev
```

3. Buka http://localhost:3000

Perintah lain:
- Build produksi: `npm run build`
- Jalankan production server: `npm run start`
- Lint: `npm run lint`

## Catatan teknis
- Versi Next.js aktif di package.json; kode menggunakan App Router (struktur `src/app`).
- Styling tampak memakai Tailwind (lihat `globals.css` dan dependensi `tailwindcss`).
- Tidak ada variabel lingkungan kritis yang ditemukan di repo ini; jika ada backend/AI service, dokumentasikan endpoint/secret di file terpisah sebelum deploy.
- `AGENTS.md` berisi blok yang dikelola otomatis oleh Next — jangan hapus bagian yang dihasilkan oleh `next dev` jika tidak ingin di-recreate.

## Contribution
- Buat branch fitur/bug, ajukan PR dengan deskripsi singkat perubahan dan tangkapan layar bila UI berubah.
- Sertakan testing manual langkah singkat pada PR untuk perubahan UI/UX.

## Deploy
- Direkomendasikan: Vercel (otomatis untuk Next.js).
- Pastikan variabel environment (jika ada backend/AI) diset pada dashboard deployment.
