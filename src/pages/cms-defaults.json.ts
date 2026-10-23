// Әкімші бөліміне: кодтағы бастапқы мәндер (әкімші «бастапқыға қайтару» басқанда және тізімдерді көрсету үшін)
import { galleryDefaults, galleryCategories, certDefaults, certCategories, galleryCategoriesFor, certCategoriesFor } from '../data/media';
import { videoGroups } from '../data/videos';
import { contactDefaults } from '../data/site';

export function GET() {
  return new Response(JSON.stringify({ gallery: galleryDefaults(), galleryCategories, certificates: certDefaults(), certCategories, videoGroups, contacts: contactDefaults, catNames: { gallery: { ru: galleryCategoriesFor('ru') }, cert: { ru: certCategoriesFor('ru') } } }), { headers: { 'content-type': 'application/json' } });
}
