'use client';

import { useEffect, useState } from 'react';
import { Menu, X, ScrollText, ArrowRight } from 'lucide-react';
import { localePath } from '@/lib/i18n';
import LanguageSwitch from './LanguageSwitch';
import { NakaLogo, PlanBLogo, XautBadge } from './Brand';
import Button from './ui/Button';
import { cn } from './ui/cn';

export default function Navbar({ t, locale, onOpenRules }) {
  const links = [
    { label: t.nav.howItWorks, href: '#come-funziona' },
    { label: t.nav.prizes, href: '#montepremi' },
    { label: t.nav.map, href: '#mappa' },
    { label: t.nav.upload, href: '#partecipa' },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Chiude il menu mobile quando si torna a viewport desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open
          ? 'border-b border-white/10 bg-ink-deep/85 backdrop-blur-xl shadow-lg shadow-black/40'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href={localePath(locale)} className="flex shrink-0 items-center gap-3" aria-label={t.nav.home}>
          <NakaLogo />
          <span className="hidden h-8 w-px bg-white/10 xl:block" />
          <XautBadge className="hidden xl:inline-flex" />
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenRules}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-white"
          >
            <ScrollText className="h-4 w-4" />
            {t.nav.rules}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <PlanBLogo className="hidden md:inline-flex" />
          <LanguageSwitch locale={locale} />
          <Button as="a" href="#partecipa" size="sm" className="hidden sm:inline-flex">
            {t.nav.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-white transition hover:border-gold/40 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        id="mobile-nav"
        className={cn(
          'overflow-hidden border-t border-white/10 bg-ink-deep/95 backdrop-blur-xl transition-[max-height] duration-300 lg:hidden',
          open ? 'max-h-96' : 'max-h-0 border-t-0'
        )}
      >
        <div className="space-y-1 px-5 py-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenRules?.();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium text-muted transition hover:bg-white/5 hover:text-white"
          >
            <ScrollText className="h-4 w-4" />
            {t.nav.rules}
          </button>
          <Button as="a" href="#partecipa" onClick={() => setOpen(false)} className="mt-2 w-full">
            {t.nav.cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
