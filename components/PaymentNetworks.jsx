import AssetMark from './AssetMark';
import GlassCard from './ui/GlassCard';
import { PAYMENT_ASSETS } from '@/lib/constants';

/**
 * Riquadro delle reti accettate, condiviso dalle due varianti del concorso.
 *
 * Esiste come componente e non come due blocchi gemelli perché è la parte che *non* cambia
 * tra premio in oro e premio in bitcoin: si paga allo stesso modo, cambia solo cosa si vince.
 * Tenerlo in un posto solo evita che una correzione alle reti finisca su una pagina sola.
 */
export default function PaymentNetworks({ title, on = 'su', note, className = 'mt-10' }) {
  return (
    <GlassCard hover={false} className={`${className} p-7 sm:p-8`}>
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {PAYMENT_ASSETS.map((asset) => (
          <div
            key={asset.code}
            className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <AssetMark code={asset.code} className="h-10 w-10 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-white">{asset.label}</span>
                <span className="font-mono text-xs text-muted">{asset.code}</span>
              </div>
              <p className="mt-1 text-sm text-gold">
                <span className="text-muted">{on} </span>
                {asset.networks.join(' · ')}
              </p>
            </div>
          </div>
        ))}
      </div>
      {note && <p className="mt-4 text-xs leading-relaxed text-muted/80">{note}</p>}
    </GlassCard>
  );
}
