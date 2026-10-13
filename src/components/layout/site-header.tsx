'use client';

import { useEffect, useState } from 'react';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/** Id section yang ditunjuk oleh link navigasi (`#galeri` → `galeri`). */
const sectionIds = siteConfig.nav.map((item) => item.href.replace('#', ''));

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Header transparan di atas hero, mendapat latar begitu halaman discroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tandai section yang sedang dibaca (melewati sepertiga atas layar).
  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // section terakhir (paling bawah) yang terlihat menang
        setActive(sectionIds.filter((id) => visible.has(id)).at(-1) ?? null);
      },
      { rootMargin: '-33% 0px -60% 0px' },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        scrolled && 'bg-background/85 backdrop-blur-md',
      )}
    >
      <div className="pointer-events-auto mx-auto flex items-baseline justify-between px-5 py-4 sm:px-8">
        <a href="#konten" className="font-display text-2xl leading-none font-extrabold">
          {siteConfig.owner}
        </a>
        <nav aria-label="Navigasi utama" className="flex gap-6 text-sm">
          {siteConfig.nav.map((item) => {
            const isActive = active === item.href.replace('#', '');
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative py-1 transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
                {isActive ? (
                  // goresan pensil grease di bawah section aktif
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    className="absolute -bottom-0.5 left-0 h-1.5 w-full text-grease"
                  >
                    <path
                      d="M1 5.5 C 22 2, 48 6.5, 70 3.5 S 92 4, 99 2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                ) : null}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
