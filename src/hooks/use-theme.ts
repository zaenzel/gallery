'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme';

const SYSTEM_QUERY = '(prefers-color-scheme: dark)';

function readStored(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function subscribe(callback: () => void) {
  // Sumber kebenaran: atribut data-theme di <html>.
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // Selama pengunjung belum memilih sendiri, ikuti perubahan tema sistem.
  const media = window.matchMedia(SYSTEM_QUERY);
  const onSystemChange = () => {
    if (!readStored()) apply(media.matches ? 'dark' : 'light');
  };
  media.addEventListener('change', onSystemChange);

  return () => {
    observer.disconnect();
    media.removeEventListener('change', onSystemChange);
  };
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
// Di server tema belum diketahui; script di <head> yang menentukan sebelum hydration.
const getServerSnapshot = (): Theme => 'light';

/** Tema yang sedang aktif + cara mengubahnya. Pilihan disimpan di localStorage. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    apply(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // mode privat / storage diblokir: tema tetap berubah untuk sesi ini
    }
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(getSnapshot() === 'dark' ? 'light' : 'dark'),
    [setTheme],
  );

  return { theme, setTheme, toggleTheme };
}
