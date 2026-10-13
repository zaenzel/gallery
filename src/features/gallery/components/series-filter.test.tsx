import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Series } from '../types/photo';
import { SeriesFilter } from './series-filter';

const series: Series[] = [
  { slug: 'jarak', title: 'Jarak', description: '' },
  { slug: 'diam', title: 'Diam', description: '' },
];

describe('SeriesFilter', () => {
  it('menandai seri aktif dengan aria-pressed', () => {
    render(
      <SeriesFilter
        series={series}
        counts={{ jarak: 3, diam: 2 }}
        total={5}
        active="diam"
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: /Diam/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Semua/ })).toHaveAttribute('aria-pressed', 'false');
  });

  it('mengirim undefined saat memilih "Semua"', async () => {
    const onChange = vi.fn();
    render(
      <SeriesFilter series={series} counts={{}} total={5} active="jarak" onChange={onChange} />,
    );

    await userEvent.click(screen.getByRole('button', { name: /Semua/ }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
