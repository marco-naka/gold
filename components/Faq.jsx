'use client';

import { useState } from 'react';
import { ChevronDown, LifeBuoy } from 'lucide-react';
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
            <GlassCard key={item.q} hover={false} className={cn('overflow-hidden', isOpen && 'border-gold/40')}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className={cn('text-sm font-semibold sm:text-base', isOpen ? 'text-gold' : 'text-white')}>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-muted transition-transform duration-300',
                      isOpen && 'rotate-180 text-gold'
                    )}
                  />
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                className={cn(
                  'grid transition-all duration-300',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-sm leading-relaxed text-muted">{item.a}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard hover={false} className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 p-7 text-center sm:flex-row sm:text-left">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
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
