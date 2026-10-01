/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Serve a `instrumentation.js`, che all'avvio del server fa partire l'estrazione automatica.
  experimental: { instrumentationHook: true },

  // La pagina dei commercianti si è chiamata /best-social-video e poi /best-social-content,
  // quando conteneva solo il premio social. Ora contiene tutti e tre i premi merchant e sta su
  // /commercianti (/en/merchants): i redirect permanenti evitano che un link già condiviso —
  // o stampato su un QR — finisca su un 404. Il frammento #commercianti lo conserva il browser.
  async redirects() {
    const merchantPage = ['/best-social-video', '/best-social-content'];
    return [
      // /bitcoin era la pagina clienti della variante in satoshi, quando le due ipotesi di
      // montepremi convivevano. Ora i premi dei clienti SONO in bitcoin e quella pagina è la
      // home: chi ha il vecchio link ci arriva senza passare da un 404.
      { source: '/bitcoin', destination: '/', permanent: true },
      { source: '/en/bitcoin', destination: '/en', permanent: true },
      ...merchantPage.map((source) => ({ source, destination: '/commercianti', permanent: true })),
      ...merchantPage.map((source) => ({
        source: `/en${source}`,
        destination: '/en/merchants',
        permanent: true,
      })),
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Impedisce che la pagina del concorso venga incorniciata in un sito terzo
          // che ne imiti l'aspetto per raccogliere email e scontrini.
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), payment=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
