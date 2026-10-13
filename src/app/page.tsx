import { siteConfig } from '@/config/site';
import {
  GallerySection,
  getContactSheet,
  getPhotos,
  getSeries,
  HomeContactSection,
  HomeHero,
} from '@/features/gallery';

/** Satu-satunya halaman: hero 3D → lembar kontak → galeri. */
export default async function HomePage() {
  const [photos, series, contactSheet] = await Promise.all([
    getPhotos(),
    getSeries(),
    getContactSheet(9),
  ]);

  return (
    <>
      <HomeHero
        ownerName={siteConfig.owner}
        photos={photos.slice(0, 8)}
        photoCount={photos.length}
        seriesCount={series.length}
      />
      <HomeContactSection photos={contactSheet} totalCount={photos.length} />
      <GallerySection photos={photos} series={series} />
    </>
  );
}
