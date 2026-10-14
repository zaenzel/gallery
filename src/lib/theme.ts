/** Kunci localStorage untuk pilihan tema yang dibuat pengunjung. Tanpa nilai = ikut sistem. */
export const THEME_STORAGE_KEY = 'theme';

export type Theme = 'light' | 'dark';

/**
 * Dijalankan sebelum halaman digambar (inline di <head>) supaya tema langsung benar,
 * tanpa kedipan terang → gelap. Tulis dalam ES5 sederhana; jangan impor apa pun di sini.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`;
