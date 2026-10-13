import { env } from './env';

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  owner: 'Ardi',
  description: 'Galeri foto Ardi: karya yang sudah dipublikasikan, disusun per seri.',
  /** Satu halaman: navigasi berupa anchor ke id section. */
  nav: [
    { label: 'Lembar kontak', href: '#lembar-kontak' },
    { label: 'Galeri', href: '#galeri' },
  ],
} as const;
