import { getContactSheet, getPhotos, getSeries } from './get-photos';

describe('get-photos', () => {
  it('setiap foto tergabung dengan seri yang ada', async () => {
    const [photos, series] = await Promise.all([getPhotos(), getSeries()]);
    const slugs = new Set(series.map((s) => s.slug));

    expect(photos.length).toBeGreaterThan(0);
    for (const photo of photos) {
      expect(slugs.has(photo.series.slug)).toBe(true);
    }
  });

  it('id foto unik karena dipakai di URL', async () => {
    const photos = await getPhotos();
    expect(new Set(photos.map((p) => p.id)).size).toBe(photos.length);
  });

  it('contact sheet mengikuti batas jumlah frame', async () => {
    expect(await getContactSheet(4)).toHaveLength(4);
  });
});
