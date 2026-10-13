# Ardi Gallery

Situs galeri foto Ardi: karya yang sudah dipublikasikan, ditampilkan dengan animasi dan komponen
3D. Konsep visualnya meja cahaya fotografer — slide berbingkai putih, strip film bernomor frame,
dan lingkaran pensil merah untuk frame pilihan.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · React Three Fiber + Drei
(3D) · Motion (animasi) · Lenis (smooth scroll).

## Menjalankan

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Buka http://localhost:3000. Foto saat ini **dummy dari picsum.photos**, jadi butuh koneksi
internet.

## Isi halaman

Situs ini satu halaman, dibaca dari atas ke bawah:

1. **Hero 3D** — slide foto melayang di atas nama, miring mengikuti kursor. Klik slide untuk
   membuka fotonya.
2. **Lembar kontak** (`#lembar-kontak`) — 9 frame dalam strip film, frame pilihan dilingkari.
3. **Galeri** (`#galeri`) — carousel 3D melingkar (tarik atau panah kiri/kanan), filter per
   seri, grid foto, dan lightbox.

Link bisa dibagikan: `/?seri=jarak` membuka filter seri, `/?foto=<id>` langsung membuka foto di
lightbox.

## Mengganti foto dummy dengan foto asli

1. Taruh foto di `public/photos/`.
2. Edit `src/mocks/photos.ts`: judul, seri, tahun, tempat, dan `src` (mis. `/photos/dermaga.jpg`).
   Isi `width`/`height` sesuai ukuran asli foto.
3. Hapus izin Picsum di `next.config.ts` (`images.remotePatterns`).

Kalau nanti foto dikelola lewat CMS, cukup ubah `src/features/gallery/api/get-photos.ts`.
Komponen dan halaman tidak perlu disentuh.

## Mengubah tampilan

Semua warna, font, dan ukuran tipe ada di `src/styles/globals.css`. Merah pensil (`grease`)
khusus untuk menandai pilihan dan keadaan aktif.

## Perintah

| Perintah      | Fungsi                       |
| ------------- | ---------------------------- |
| `pnpm dev`    | Dev server                   |
| `pnpm build`  | Production build             |
| `pnpm check`  | Lint + typecheck + unit test |
| `pnpm format` | Prettier                     |

## Dokumentasi

- `AGENTS.md` — aturan arsitektur, konsep desain, aturan 3D. **Dibaca otomatis oleh AI agent**
  (Claude Code lewat `CLAUDE.md`, Gemini lewat `GEMINI.md`, Codex/Cursor/Copilot langsung).
- `docs/` — arsitektur, konvensi kode, cara menambah fitur.

## Aksesibilitas & performa

- Semua animasi dan 3D mati otomatis jika perangkat meminta "kurangi gerakan".
- Three.js dimuat terpisah setelah halaman tampil, jadi konten utama muncul cepat.
- Carousel 3D bisa dioperasikan dengan keyboard; lightbox mendukung Esc dan tombol panah.
