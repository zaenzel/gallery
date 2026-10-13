/**
 * DATA DUMMY — foto dari picsum.photos, judul & keterangan rekaan.
 * Saat foto asli siap: ganti isi file ini (atau ganti sumber di
 * `src/features/gallery/api/get-photos.ts` ke CMS/backend), lalu
 * hapus izin Picsum di `next.config.ts`.
 */
import type { Photo, Series } from '@/features/gallery';

export const seriesData: Series[] = [
  {
    slug: 'jarak',
    title: 'Jarak',
    description: 'Ruang di antara orang dan tempat yang mereka tinggalkan.',
  },
  {
    slug: 'cahaya-sore',
    title: 'Cahaya Sore',
    description: 'Satu jam terakhir sebelum matahari turun, di kota-kota yang sedang pulang.',
  },
  {
    slug: 'diam',
    title: 'Diam',
    description: 'Tempat-tempat yang tidak meminta untuk difoto.',
  },
];

type Seed = {
  picsumId: number;
  title: string;
  series: string;
  year: number;
  place: string;
  ratio: 'landscape' | 'portrait' | 'square' | 'tall';
  featured?: boolean;
};

const sizes = {
  landscape: [1500, 1000],
  portrait: [1000, 1500],
  square: [1200, 1200],
  tall: [1200, 1500],
} as const;

const seeds: Seed[] = [
  {
    picsumId: 10,
    title: 'Hutan setelah hujan',
    series: 'diam',
    year: 2024,
    place: 'Malang',
    ratio: 'landscape',
    featured: true,
  },
  {
    picsumId: 11,
    title: 'Danau yang belum bangun',
    series: 'diam',
    year: 2023,
    place: 'Dieng',
    ratio: 'portrait',
  },
  {
    picsumId: 13,
    title: 'Garis pantai',
    series: 'jarak',
    year: 2024,
    place: 'Gunungkidul',
    ratio: 'landscape',
  },
  {
    picsumId: 15,
    title: 'Batu di sungai kecil',
    series: 'diam',
    year: 2022,
    place: 'Bogor',
    ratio: 'tall',
  },
  {
    picsumId: 16,
    title: 'Laut tanpa kapal',
    series: 'jarak',
    year: 2023,
    place: 'Lombok',
    ratio: 'landscape',
    featured: true,
  },
  {
    picsumId: 17,
    title: 'Jalan ke rumah nenek',
    series: 'jarak',
    year: 2021,
    place: 'Kediri',
    ratio: 'square',
  },
  {
    picsumId: 18,
    title: 'Rumput di pinggir rel',
    series: 'cahaya-sore',
    year: 2024,
    place: 'Bandung',
    ratio: 'portrait',
  },
  {
    picsumId: 28,
    title: 'Jalur setapak',
    series: 'diam',
    year: 2023,
    place: 'Bromo',
    ratio: 'landscape',
  },
  {
    picsumId: 29,
    title: 'Puncak yang tertutup',
    series: 'jarak',
    year: 2022,
    place: 'Sindoro',
    ratio: 'tall',
    featured: true,
  },
  {
    picsumId: 37,
    title: 'Menunggu bus terakhir',
    series: 'cahaya-sore',
    year: 2024,
    place: 'Jakarta',
    ratio: 'landscape',
  },
  {
    picsumId: 39,
    title: 'Atap-atap',
    series: 'cahaya-sore',
    year: 2023,
    place: 'Semarang',
    ratio: 'square',
  },
  {
    picsumId: 43,
    title: 'Kota yang pulang',
    series: 'cahaya-sore',
    year: 2024,
    place: 'Jakarta',
    ratio: 'portrait',
    featured: true,
  },
  {
    picsumId: 49,
    title: 'Jendela lantai tiga',
    series: 'jarak',
    year: 2021,
    place: 'Yogyakarta',
    ratio: 'landscape',
  },
  {
    picsumId: 54,
    title: 'Sisa siang',
    series: 'cahaya-sore',
    year: 2022,
    place: 'Surabaya',
    ratio: 'tall',
  },
  {
    picsumId: 58,
    title: 'Dermaga kosong',
    series: 'jarak',
    year: 2024,
    place: 'Banyuwangi',
    ratio: 'landscape',
  },
  {
    picsumId: 62,
    title: 'Kabut pagi',
    series: 'diam',
    year: 2023,
    place: 'Wonosobo',
    ratio: 'square',
  },
  {
    picsumId: 65,
    title: 'Wajah di kerumunan',
    series: 'cahaya-sore',
    year: 2024,
    place: 'Solo',
    ratio: 'portrait',
  },
  {
    picsumId: 76,
    title: 'Lapangan setelah upacara',
    series: 'jarak',
    year: 2022,
    place: 'Klaten',
    ratio: 'landscape',
  },
];

export const photosData: Photo[] = seeds.map((seed, i) => {
  const [width, height] = sizes[seed.ratio];
  return {
    id: seed.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    title: seed.title,
    seriesSlug: seed.series,
    year: seed.year,
    place: seed.place,
    frame: String(i + 1).padStart(2, '0'),
    src: `https://picsum.photos/id/${seed.picsumId}/${width}/${height}`,
    width,
    height,
    alt: `${seed.title}, ${seed.place} ${seed.year}`,
    featured: seed.featured ?? false,
  };
});
