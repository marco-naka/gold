/**
 * URL pubblico del sito. In locale vale localhost; in produzione va impostata
 * NEXT_PUBLIC_SITE_URL (oggi https://naka-paga-in-crypto.onrender.com) prima della build.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
