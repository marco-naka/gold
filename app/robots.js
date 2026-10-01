import { SITE_URL } from '@/lib/site';

export default function robots() {
  return {
    // /rilevazioni è l'area interna dei rilevatori: non va indicizzata.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/rilevazioni'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
