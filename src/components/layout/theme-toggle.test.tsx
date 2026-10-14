import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeToggle } from './theme-toggle';

function mockSystemTheme(dark: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: dark && query.includes('dark'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    mockSystemTheme(false);
  });

  it('beralih terang → gelap dan menyimpan pilihan', async () => {
    document.documentElement.dataset.theme = 'light';
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Ganti ke tema gelap' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Ganti ke tema terang' })).toBeInTheDocument();
  });

  it('beralih kembali gelap → terang', async () => {
    document.documentElement.dataset.theme = 'dark';
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Ganti ke tema terang' }));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(window.localStorage.getItem('theme')).toBe('light');
  });
});
