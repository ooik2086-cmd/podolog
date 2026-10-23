// Әкімші бөліміне: кодтағы бастапқы мәндер (әкімші «бастапқыға қайтару» басқанда және тізімдерді көрсету үшін)
import { galleryDefaults, galleryCategories, certDefaults, certCategories } from '../data/media';
import { videoGroups } from '../data/videos';
import { contactDefaults } from '../data/site';

export function GET() {
  return new Response(JSON.stringify({ gallery: galleryDefaults(), galleryCategories, certificates: certDefaults(), certCategories, videoGroups, contacts: contactDefaults }), { headers: { 'content-type': 'application/json' } });
}
