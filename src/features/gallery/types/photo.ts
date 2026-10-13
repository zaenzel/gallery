export type Series = {
  slug: string;
  title: string;
  description: string;
};

export type Photo = {
  /** slug unik, dipakai di URL (`/gallery?foto=<id>`) */
  id: string;
  title: string;
  seriesSlug: string;
  year: number;
  place: string;
  /** nomor frame seperti tercetak di tepi film */
  frame: string;
  /** URL resolusi penuh */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** ditandai sebagai pilihan di contact sheet beranda */
  featured: boolean;
};

export type PhotoWithSeries = Photo & { series: Series };
