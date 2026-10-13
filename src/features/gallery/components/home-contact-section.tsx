import type { PhotoWithSeries } from '../types/photo';
import { ContactSheet } from './contact-sheet';

type HomeContactSectionProps = {
  photos: PhotoWithSeries[];
  totalCount: number;
};

export function HomeContactSection({ photos, totalCount }: HomeContactSectionProps) {
  return (
    <section
      id="lembar-kontak"
      aria-labelledby="lembar-kontak-judul"
      className="mt-28 scroll-mt-16 px-5 pt-6 sm:mt-40 sm:px-8"
    >
      <div className="mb-14 grid gap-6 sm:mb-20 lg:grid-cols-[1fr_22rem] lg:items-end">
        <h2
          id="lembar-kontak-judul"
          className="font-display text-headline leading-[0.82] font-black tracking-[-0.01em]"
        >
          Lembar kontak
        </h2>
        <p className="max-w-sm leading-relaxed text-muted-foreground">
          {photos.length} frame pertama dari roll terbaru. Yang dilingkari merah adalah pilihanku
          untuk dicetak.
        </p>
      </div>

      <ContactSheet photos={photos} />

      <div className="mt-16 flex justify-end sm:mt-24">
        <a
          href="#galeri"
          className="group font-display text-title leading-none font-bold transition-colors hover:text-grease"
        >
          Lihat semua {totalCount} foto
          <span className="block h-0.5 origin-left scale-x-100 bg-current transition-transform duration-300 group-hover:scale-x-50" />
        </a>
      </div>
    </section>
  );
}
