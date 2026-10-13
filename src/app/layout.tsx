import type { Metadata, Viewport } from 'next';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { siteConfig } from '@/config/site';
import { AppProviders } from '@/providers/app-providers';

import '@fontsource-variable/big-shoulders';
import '@fontsource-variable/hanken-grotesk';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: '#e6ecee',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AppProviders>
          <a
            href="#konten"
            className="sr-only z-50 bg-foreground px-4 py-2 text-card focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Lompat ke konten
          </a>
          <SiteHeader />
          <main id="konten" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
