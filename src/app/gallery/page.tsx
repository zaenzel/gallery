import { permanentRedirect } from 'next/navigation';

/** Sementara: halaman /gallery sudah digabung ke beranda. Hapus folder src/app/gallery. */
export default function GalleryRedirect() {
  permanentRedirect('/#galeri');
}
