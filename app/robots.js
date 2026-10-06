import { SITE_URL } from '@/lib/site';

export default function robots() {
  return {
    // /rilevazioni e /admin sono aree interne: non vanno indicizzate.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/rilevazioni', '/admin'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
