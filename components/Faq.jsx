'use client';

import { useState } from 'react';
import { ChevronDown, LifeBuoy, Search } from 'lucide-react';
import SectionTitle from './ui/SectionTitle';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import { cn } from './ui/cn';
import { CONTEST } from '@/lib/constants';

export default function Faq({ t }) {
  const FAQS = t.items;

  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section-pad">
      <SectionTitle eyebrow={t.eyebrow} title={t.title} />

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <GlassCard
              key={item.q}
              hover={false}
              className={cn('overflow-hidden', isOpen && 'border-btc/40')}
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={cn('text-sm font-semibold sm:text-base', isOpen ? 'text-btc' : 'text-white')}
                  >
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-muted transition-transform duration-300',
                      isOpen && 'rotate-180 text-btc',
                    )}
                  />
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                className={cn(
                  'grid transition-all duration-300',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="overflow-hidden px-6 pb-6">
                  <p className="text-sm leading-relaxed text-muted">{item.a}</p>
                  {/*
                    Una risposta che rimanda a un'altra parte della pagina la chiude con il
                    pulsante che ci porta: dire «lo trovi nella mappa» e lasciare che sia il
                    lettore a cercarla è mezzo lavoro.
                  */}
                  {item.cta && (
                    <Button
                      as="a"
                      href={item.cta.href}
                      variant="secondary"
                      size="sm"
                      className="mt-4"
                      onClick={() => setOpen(-1)}
                    >
                      <Search className="h-4 w-4" />
                      {item.cta.label}
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard
        hover={false}
        className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 p-7 text-center sm:flex-row sm:text-left"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-btc/25 bg-btc/10 text-btc">
          <LifeBuoy className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{t.helpTitle}</p>
          <p className="mt-1 text-xs text-muted">{t.helpText}</p>
        </div>
        <Button as="a" href={`mailto:${CONTEST.supportEmail}`} variant="secondary" size="sm">
          {t.helpCta}
        </Button>
      </GlassCard>
    </section>
  );
}
