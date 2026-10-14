'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/hooks/use-theme';

/**
 * Tombol ganti tema terang/gelap. Ikon dipilih lewat varian CSS `dark:` (bukan state React)
 * supaya HTML dari server sudah benar dan tidak berkedip.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'terang' : 'gelap';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Ganti ke tema ${next}`}
      title={`Tema ${next}`}
      className="-my-1 grid size-9 place-items-center text-muted-foreground transition-colors hover:text-foreground"
    >
      <Moon aria-hidden="true" className="size-[1.1rem] dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-[1.1rem] dark:block" />
    </button>
  );
}
