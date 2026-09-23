/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // La pagina si chiamava /best-social-video: un redirect permanente evita che un link
  // già condiviso (o stampato su un QR) finisca su un 404.
  async redirects() {
    return [
      { source: '/best-social-video', destination: '/best-social-content', permanent: true },
      { source: '/en/best-social-video', destination: '/en/best-social-content', permanent: true },
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
