# AGENTS.md

Panduan untuk AI coding agent (Claude Code, Codex, Cursor, Copilot, Gemini, dll) dan developer
yang bekerja di repo ini. **Baca file ini sebelum menulis kode.** Detail ada di folder `docs/`.

## Ringkasan proyek

**Ardi Gallery**: situs galeri foto pribadi Ardi yang sudah dipublikasikan, penuh foto, animasi,
dan komponen 3D. Dibangun dari template frontend **Next.js (App Router) + TypeScript strict**
dengan struktur **feature-based**. Fitur `gallery` adalah fitur utama — baca bagian
"Khusus proyek ini" di bawah sebelum mengubahnya.

| Kebutuhan                          | Pakai                                     | Jangan pakai                                 |
| ---------------------------------- | ----------------------------------------- | -------------------------------------------- |
| Data dari server                   | TanStack Query (`useQuery`/`useMutation`) | `useEffect` + `fetch` manual                 |
| State UI global                    | Zustand (`features/*/stores`)             | Context untuk state yang sering berubah      |
| State yang bisa dibagikan via link | URL search params                         | Zustand                                      |
| Form                               | React Hook Form + Zod (`zodResolver`)     | `useState` per field                         |
| HTTP                               | `api` dari `@/lib/api-client` (axios)     | `fetch`/`axios` langsung di komponen         |
| Styling                            | Tailwind CSS v4 + token di `globals.css`  | CSS module, inline style, warna hex hardcode |
| Komponen dasar                     | `src/components/ui` (gaya shadcn/ui)      | Library UI lain tanpa diskusi                |
| Env variable                       | `env` dari `@/config/env`                 | `process.env.X` langsung                     |

## Perintah

```bash
pnpm dev           # dev server (http://localhost:3000)
pnpm lint          # ESLint, termasuk aturan arsitektur
pnpm typecheck     # next typegen + tsc
pnpm test          # unit test (Vitest)
pnpm test:e2e      # E2E (Playwright) — butuh `pnpm exec playwright install chromium` sekali
pnpm check         # lint + typecheck + test (jalankan sebelum selesai)
pnpm build         # production build
```

Package manager: **pnpm**. Jangan pakai npm/yarn, jangan commit lockfile lain.

## Peta folder

```
src/
├── app/                 ROUTING SAJA. page.tsx tipis, memanggil komponen dari features/.
│   └── page.tsx         SATU-SATUNYA halaman: hero 3D → lembar kontak → galeri
├── features/<nama>/     LOGIKA BISNIS per domain
│   ├── api/             fungsi fetch + hook TanStack Query + query-keys.ts
│   ├── components/      komponen milik fitur (smart *-container.tsx & dumb)
│   ├── hooks/           hook khusus fitur
│   ├── schemas/         schema Zod (dipakai form & validasi API)
│   ├── stores/          store Zustand (state UI fitur)
│   ├── types/           tipe & konstanta domain
│   └── index.ts         PUBLIC API — satu-satunya pintu masuk dari luar
├── components/
│   ├── ui/              primitive (Button, Input, Card…). Wajib dumb.
│   ├── common/          komponen generik (EmptyState, ErrorState…). Wajib dumb.
│   └── layout/          Header, Sidebar, dll
├── hooks/               hook generik (useDebounce). Tidak tahu soal fitur.
├── lib/                 api-client, query-client, utils
├── config/              env.ts (validasi env), site.ts
├── providers/           provider global (QueryClientProvider, dll)
├── types/               tipe global (Paginated, ApiError)
├── styles/globals.css   design token Tailwind
└── mocks/photos.ts      DATA DUMMY foto (Picsum). Ganti dengan foto asli.
```

## Aturan WAJIB

Aturan bertanda 🔒 dijaga oleh ESLint (`pnpm lint` akan gagal).

1. 🔒 **Hanya `src/features/<fitur>/api/*` yang boleh memakai `axios` atau `@/lib/api-client`.**
   Komponen mendapat data lewat hook (`useProducts`) atau fungsi API (`getProducts`) dari fitur.
2. 🔒 **Dari luar fitur, import hanya lewat `@/features/<fitur>`** (index.ts). Jangan
   `@/features/products/components/...`.
3. 🔒 **Fitur tidak boleh import fitur lain.** Di dalam fitur, gunakan import relatif
   (`../api/get-products`). Kode yang dipakai bersama → pindahkan ke `components/`, `hooks/`, atau `lib/`.
4. 🔒 **Kode shared (`components`, `hooks`, `lib`, `providers`, `config`, `types`) tidak boleh
   import dari `features/`.**
5. **`app/**/page.tsx` harus tipis**: metadata, layout halaman, dan render container dari fitur.
   Tidak ada logika bisnis, tidak ada `useQuery` di page.
6. **Smart vs dumb**: komponen yang memanggil hook data/store diberi akhiran `-container.tsx`.
   Komponen lain menerima semua data lewat props. `components/ui` dan `components/common` selalu dumb.
7. **Semua query key dibuat dari `query-keys.ts`** milik fitur. Mutation wajib meng-invalidate key
   yang terdampak.
8. **Validasi pakai Zod**, satu schema dipakai bersama oleh form dan API.
9. **Tambahkan `'use client'` hanya jika perlu** (hook, event handler, browser API). Default-nya
   Server Component.
10. **Jangan mengubah file di `components/ui/` untuk kebutuhan satu fitur.** Bungkus atau buat
    varian baru lewat `cva`.
11. **TypeScript strict**: tanpa `any`, tanpa `@ts-ignore`. Gunakan `import type` untuk tipe.
12. **Teks UI berbahasa Indonesia.** Nama variabel, fungsi, file dalam bahasa Inggris.

## Penamaan

- File & folder: `kebab-case` (`product-card.tsx`, `use-product-list-params.ts`).
- Komponen: `PascalCase`, named export (bukan default), kecuali file khusus Next.js
  (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`).
- Hook: `useXxx`. Hook query: `useProducts`, mutation: `useCreateProduct`.
- Fungsi API: kata kerja + resource (`getProducts`, `createProduct`, `updateProduct`).
- File API: satu operasi per file (`get-products.ts`, `create-product.ts`).
- Test: berdampingan dengan file yang dites, akhiran `.test.ts(x)`.

## Alur kerja umum

- **Fitur baru** → ikuti `docs/adding-a-feature.md`.
- **Konten baru** → tambahkan section di `src/app/page.tsx` (situs ini satu halaman).
- **Komponen shadcn baru** → `pnpm dlx shadcn@latest add <nama>` (config di `components.json`).
- **Env variable baru** → tambahkan ke `src/config/env.ts` (schema + `runtimeEnv`) dan `.env.example`.
- **Ganti foto dummy dengan foto asli** → lihat "Data galeri" di bawah.

## Khusus proyek ini

### Konsep desain: meja cahaya

Situs meniru meja cahaya fotografer: permukaan bercahaya dingin, slide foto berbingkai putih,
strip film dengan nomor frame, dan lingkaran pensil grease merah untuk menandai pilihan.

- **Satu tema terang saja.** Tidak ada dark mode; latar bercahaya adalah identitasnya.
- **Merah grease (`text-grease`/`bg-grease`) HANYA untuk menandai pilihan/keadaan aktif**
  (frame pilihan, seri aktif, halaman aktif, fokus). Jangan dipakai sebagai warna dekorasi.
- **Amber film (`text-film`)** hanya untuk nomor frame dan cetakan tepi film.
- **Tipografi:** `font-display` (Big Shoulders, condensed) untuk nama, judul, dan nomor frame;
  `font-sans` (Hanken Grotesk) untuk teks. Ukuran besar memakai token `text-display`,
  `text-headline`, `text-title`.
- **Hindari:** label huruf kapital di atas judul, pemisah titik tengah (`A · B`), panah di teks
  tombol, animasi fade-up di setiap section. Gerakan otomatis cukup satu momen per halaman.

### Data galeri

- Semua data foto lewat `src/features/gallery/api/get-photos.ts` (`getPhotos`, `getSeries`,
  `getContactSheet`). Saat ini membaca `src/mocks/photos.ts`.
- Konten galeri statis, jadi diambil di **Server Component** (halaman di-prerender) dan tidak
  memakai TanStack Query.
- Untuk foto asli: taruh file di `public/photos/` dan ubah `src` di `src/mocks/photos.ts`, atau
  ganti isi `get-photos.ts` agar membaca CMS. Lalu hapus izin Picsum di `next.config.ts`.
  Komponen tidak perlu diubah.
- `width`/`height` foto WAJIB sesuai rasio aslinya — dipakai untuk layout grid dan 3D.

### Satu halaman

- Situs ini **sengaja satu halaman** (`src/app/page.tsx`). Jangan menambah route baru; konten
  baru menjadi section di halaman itu.
- Tiap section punya `id` (`lembar-kontak`, `galeri`) dan `scroll-mt-16` supaya tidak tertutup
  header. Jarak antar-section memakai **margin**, bukan padding, agar anchor mendarat di judul.
- Navigasi di `siteConfig.nav` berupa anchor (`#galeri`). Header menandai section yang sedang
  dibaca secara otomatis. Lenis menangani scroll halus untuk anchor.

### State di URL

- `/?seri=<slug>` = filter seri, `/?foto=<id>` = lightbox terbuka.
  Keduanya bisa dibagikan sebagai link. Navigasi yang mengubah param ini memakai
  `scroll: false` supaya posisi baca tidak loncat. Komponen yang membaca `useSearchParams`
  harus berada di dalam `<Suspense>`.

### Aturan 3D (React Three Fiber)

- Semua komponen 3D ada di `src/features/gallery/components/three/` dan **dimuat lewat
  `next/dynamic` dengan `ssr: false`** dari komponen pembungkusnya, supaya Three.js tidak
  memperlambat render awal.
- `Slide` adalah satu-satunya objek foto 3D. Tata letak ditentukan parent lewat `getTarget`
  (posisi tujuan per frame); slide bergerak halus ke sana.
- **Animasi per frame memakai ref + `useFrame`, bukan `useState`** (state memicu re-render 60x/detik).
- Tekstur memakai `optimizedImageUrl()` (lewat optimizer Next, same-origin, WebP kecil).
- **Wajib menghormati `usePrefersReducedMotion()`**: tanpa animasi pembuka, tanpa putaran otomatis,
  tanpa goyangan.
- Interaksi 3D harus punya padanan keyboard (carousel: panah kiri/kanan) dan label aksesibel.
- Halaman berisi lebih dari satu `<Canvas>`: setiap scene memakai `useInView` dan
  `frameloop={inView ? 'always' : 'never'}` supaya scene yang tidak terlihat berhenti merender.

## Definition of done

Sebelum menyatakan tugas selesai:

1. `pnpm check` lolos (lint + typecheck + test).
2. Logika baru punya unit test (minimal schema dan komponen dumb yang punya percabangan).
3. Tidak ada `console.log`, kode mati, atau TODO tanpa konteks.
4. Jika menambah pola atau aturan baru, perbarui `AGENTS.md` / `docs/`.

## Catatan versi (hindari pola lama)

- **Next.js 16**, `cacheComponents` aktif. Data dinamis di Server Component perlu dibungkus
  `<Suspense>`. Tipe `PageProps`/`LayoutProps` di-generate oleh `next typegen`.
- **React 19**: `ref` adalah props biasa — jangan pakai `forwardRef`.
- **Tailwind v4**: konfigurasi lewat CSS (`@theme` di `globals.css`), tidak ada `tailwind.config.js`.
- **Zod v4**: pesan error lewat `{ error: '...' }`; gunakan `z.flattenError(err)` bukan `err.flatten()`.
- **TanStack Query v5**: `isPending` (bukan `isLoading`) untuk mutation; `placeholderData: keepPreviousData`.

## Dokumentasi lanjutan

- `docs/architecture.md` — lapisan, alur data, server vs client, keputusan state.
- `docs/conventions.md` — gaya kode, form, error handling, testing, commit.
- `docs/adding-a-feature.md` — langkah demi langkah membuat fitur baru.
