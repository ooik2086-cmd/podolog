// Әкімші бөліміне арналған тізім: прайс жолдары мен дүкен өнімдері (бастапқы мәндерімен).
// Әкімші өзгерткен мәндер серверде сақталады (/api/content) және беттерде браузерде ауыстырылады.
import { priceGroups, priceId } from '../data/prices';
import { adminProducts, productThumb, productText } from '../data/products';
import { services, serviceText } from '../data/services';

export function GET() {
  const body = {
    prices: priceGroups.map((g) => ({ title: g.title, rows: g.rows.map((r) => ({ id: priceId(g, r), name: r.name, min: r.min, max: r.max })) })),
    services: services.map((s) => { const t = serviceText(s); return { slug: s.slug, title: { kk: t.kk.title, ru: t.ru.title, en: t.en.title }, image: s.photo || s.image }; }),
    products: adminProducts.map((p) => { const t = productText(p); return { slug: p.slug, thumb: productThumb(p), name: { kk: t.kk.name, ru: t.ru.name, en: t.en.name }, variants: p.variants.map((v) => ({ size: v.size, art: v.art, price: v.price, inStock: v.inStock })) }; }),
  };
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
}
