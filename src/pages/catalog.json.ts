// Әкімші бөліміне арналған тізім: прайс жолдары мен дүкен өнімдері (бастапқы мәндерімен).
// Әкімші өзгерткен мәндер серверде сақталады (/api/content) және беттерде браузерде ауыстырылады.
import { priceGroups, priceId } from '../data/prices';
import { visibleProducts } from '../data/products';

export function GET() {
  const body = {
    prices: priceGroups.map((g) => ({ title: g.title, rows: g.rows.map((r) => ({ id: priceId(g, r), name: r.name, min: r.min, max: r.max })) })),
    products: visibleProducts.map((p) => ({ slug: p.slug, name: p.name, variants: p.variants.map((v) => ({ size: v.size, art: v.art, price: v.price, inStock: v.inStock })) })),
  };
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
}
