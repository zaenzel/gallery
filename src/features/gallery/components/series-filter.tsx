import { cn } from '@/lib/utils';

import type { Series } from '../types/photo';

type SeriesFilterProps = {
  series: Series[];
  counts: Record<string, number>;
  total: number;
  /** `undefined` = semua seri */
  active: string | undefined;
  onChange: (slug: string | undefined) => void;
};

/** DUMB: daftar seri sebagai tombol filter. Seri aktif dicoret pensil grease. */
export function SeriesFilter({ series, counts, total, active, onChange }: SeriesFilterProps) {
  const options: { slug: string | undefined; title: string; count: number }[] = [
    { slug: undefined, title: 'Semua', count: total },
    ...series.map((s) => ({ slug: s.slug, title: s.title, count: counts[s.slug] ?? 0 })),
  ];

  return (
    <div role="group" aria-label="Filter seri" className="flex flex-wrap gap-x-8 gap-y-3">
      {options.map((opt) => {
        const isActive = opt.slug === active;
        return (
          <button
            key={opt.slug ?? 'semua'}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(opt.slug)}
            className={cn(
              'group relative font-display text-3xl leading-none font-bold transition-colors sm:text-4xl',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {opt.title}
            <sup className="ml-1 font-sans text-xs font-medium text-muted-foreground">
              {opt.count}
            </sup>
            {isActive ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2 w-full text-grease"
              >
                <path
                  d="M2 6 C 25 3, 50 8, 75 4 S 95 5, 98 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
