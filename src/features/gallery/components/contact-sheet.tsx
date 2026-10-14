'use client';

import Image from 'next/image';
import Link from 'next/link';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

import type { PhotoWithSeries } from '../types/photo';
import { GreaseCircle } from './grease-circle';

type ContactSheetProps = {
  photos: PhotoWithSeries[];
  /** jumlah frame per strip film */
  perStrip?: number;
};

// Strip diletakkan dengan tangan, jadi tidak pernah lurus sempurna.
const STRIP_TILT = ['-rotate-[0.6deg]', 'rotate-[0.4deg] sm:ml-6', '-rotate-[0.25deg] sm:-ml-3'];

/**
 * Contact sheet: frame-frame dalam strip film, frame pilihan dilingkari pensil merah.
 * Dumb: hanya menerima `photos`.
 */
export function ContactSheet({ photos, perStrip = 3 }: ContactSheetProps) {
  const reducedMotion = usePrefersReducedMotion();

  const strips: PhotoWithSeries[][] = [];
  for (let i = 0; i < photos.length; i += perStrip) strips.push(photos.slice(i, i + perStrip));

  let circled = 0;

  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      {strips.map((strip, s) => (
        <div
          key={s}
          className={cn(
            'bg-strip px-2 pt-7 pb-6 shadow-[0_18px_30px_-22px_rgb(27_34_40/0.6)] sm:px-3',
            STRIP_TILT[s % STRIP_TILT.length],
          )}
        >
          <ul className="flex snap-x snap-mandatory gap-2 overflow-x-auto sm:overflow-visible">
            {strip.map((photo) => {
              const variant = (circled % 3) as 0 | 1 | 2;
              if (photo.featured) circled += 1;

              return (
                <li
                  key={photo.id}
                  className="relative w-[78%] shrink-0 snap-center sm:w-auto sm:flex-1"
                >
                  {/* cetakan tepi film: nomor frame */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-6 left-1 font-display text-sm font-semibold tracking-wider text-film"
                  >
                    ▸ {photo.frame}
                  </span>
                  <Link
                    href={`/?foto=${photo.id}`}
                    scroll={false}
                    className="group relative block aspect-[3/2] overflow-hidden bg-muted-foreground"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, 78vw"
                      className="object-cover transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
                    />
                    <span className="absolute inset-x-0 bottom-0 translate-y-full bg-overlay/85 px-3 py-2 text-xs text-overlay-foreground transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                      {photo.title}, {photo.year}
                    </span>
                  </Link>
                  {photo.featured ? (
                    <GreaseCircle
                      variant={variant}
                      animate={!reducedMotion}
                      delay={0.15}
                      className="pointer-events-none absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] text-grease sm:-inset-4 sm:h-[calc(100%+2rem)] sm:w-[calc(100%+2rem)]"
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
          <p
            aria-hidden="true"
            className="mt-2 px-1 font-display text-xs tracking-[0.3em] text-film/70"
          >
            Ardi 400 &nbsp;&nbsp; {strip[0]?.frame}–{strip[strip.length - 1]?.frame}
          </p>
        </div>
      ))}
    </div>
  );
}
