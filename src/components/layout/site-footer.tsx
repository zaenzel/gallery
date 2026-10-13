import { siteConfig } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="px-5 pt-24 pb-8 sm:px-8">
      <div className="flex flex-col gap-2 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          © {siteConfig.owner}. Semua foto milik pemotretnya dan tidak untuk digunakan ulang tanpa
          izin.
        </p>
        <p>Dibuat di Indonesia</p>
      </div>
    </footer>
  );
}
