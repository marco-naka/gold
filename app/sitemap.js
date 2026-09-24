import { SITE_URL } from '@/lib/site';

export default function sitemap() {
  const lastModified = new Date();
  // /p è la pagina del QR: utile ma non da indicizzare, quindi resta fuori dalla sitemap.
  const pages = ['', '/best-social-content', '/privacy', { it: '/vincitori', en: '/winners' }];
  // Ogni pagina è dichiarata nelle due lingue con i rispettivi alternate hreflang.
  return pages.flatMap((page) =>
    ['it', 'en'].map((locale) => {
      const slug = typeof page === 'string' ? page : page[locale];
      const itSlug = typeof page === 'string' ? page : page.it;
      const enSlug = typeof page === 'string' ? page : page.en;
      const path = locale === 'it' ? slug : `/en${enSlug}`;
      return {
        url: `${SITE_URL}${path}`,
        lastModified,
        changeFrequency: slug ? 'monthly' : 'weekly',
        priority: slug ? 0.7 : 1,
        alternates: {
          languages: {
            it: `${SITE_URL}${itSlug}`,
            en: `${SITE_URL}/en${enSlug}`,
          },
        },
      };
    })
  );
}
