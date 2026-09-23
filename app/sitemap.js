import { SITE_URL } from '@/lib/site';

export default function sitemap() {
  const lastModified = new Date();
  const pages = ['', '/best-social-video'];
  // Ogni pagina è dichiarata nelle due lingue con i rispettivi alternate hreflang.
  return pages.flatMap((page) =>
    ['it', 'en'].map((locale) => {
      const path = locale === 'it' ? page : `/en${page}`;
      return {
        url: `${SITE_URL}${path}`,
        lastModified,
        changeFrequency: page ? 'monthly' : 'weekly',
        priority: page ? 0.7 : 1,
        alternates: {
          languages: {
            it: `${SITE_URL}${page}`,
            en: `${SITE_URL}/en${page}`,
          },
        },
      };
    })
  );
}
