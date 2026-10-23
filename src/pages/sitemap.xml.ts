// Іздеу жүйелеріне арналған беттер тізімі (Google, Яндекс). Әр бет үш тілде, бір-біріне сілтемемен.
import { services } from '../data/services';
import { visibleProducts } from '../data/products';
import { langs, localize } from '../i18n';

const pages = ['/', '/about', '/services', '/insoles', '/prices', '/shop', '/courses', '/clinics', '/certificates', '/gallery', '/reviews', '/feedback', '/contacts', '/booking', '/mission', '/privacy',
  ...services.map((s) => `/services/${s.slug}`), ...visibleProducts.map((p) => `/shop/${p.slug}`)];

export function GET({ site }: { site: URL }) {
  const abs = (l: (typeof langs)[number], p: string) => new URL(localize(l, p), site).href;
  const day = new Date().toISOString().slice(0, 10);
  const urls = pages.flatMap((p) => langs.map((l) => `<url><loc>${abs(l, p)}</loc><lastmod>${day}</lastmod>${langs.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${abs(a, p)}"/>`).join('')}<priority>${p === '/' ? '1.0' : '0.7'}</priority></url>`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'content-type': 'application/xml' } });
}
