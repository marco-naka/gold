import '../globals.css';
import { SITE_URL } from '@/lib/site';
import { localeMetadata } from '@/lib/layout-meta';
import { getDictionary } from '@/lib/i18n';
import LocaleHtml from '@/components/LocaleHtml';

export const metadata = { metadataBase: new URL(SITE_URL), ...localeMetadata('it') };

export const viewport = { themeColor: '#0F0F12', width: 'device-width', initialScale: 1 };

export default function ItalianLayout({ children }) {
  return <LocaleHtml locale="it" skipLink={getDictionary('it').meta.skipLink}>{children}</LocaleHtml>;
}
