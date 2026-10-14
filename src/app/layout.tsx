import type { Metadata, Viewport } from 'next';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { siteConfig } from '@/config/site';
import { themeInitScript } from '@/lib/theme';
import { AppProviders } from '@/providers/app-providers';

import '@fontsource-variable/big-shoulders';
import '@fontsource-variable/hanken-grotesk';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e6ecee' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1418' },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: script tema mengisi data-theme sebelum React hydrate.
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
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
