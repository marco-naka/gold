/**
 * Invio email transazionali.
 *
 * `deliver()` è l'unico punto che parla con l'esterno:
 *   - con MAIL_PROVIDER_API_KEY configurata spedisce davvero (endpoint compatibile Resend);
 *   - senza, scrive il messaggio in `.data/outbox/*.json` così in locale si può leggere
 *     esattamente ciò che l'utente riceverebbe.
 * In entrambi i casi un errore di invio non fa fallire la giocata: viene registrato e il
 * messaggio resta in outbox per essere rispedito.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CONTEST, EVENT, PRIZES, TOTAL_POOL, formatXaut } from '../constants.js';
import { getDictionary, intlLocale } from '../i18n/index.js';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const OUTBOX = join(DATA_DIR, 'outbox');
const FROM = process.env.MAIL_FROM || `${CONTEST.organizer} <${CONTEST.supportEmail}>`;
const ENDPOINT = process.env.MAIL_PROVIDER_ENDPOINT || 'https://api.resend.com/emails';

async function writeToOutbox(message, extra = {}) {
  await mkdir(OUTBOX, { recursive: true });
  const name = `${Date.now()}-${message.template}-${message.to.replace(/[^a-z0-9]/gi, '_')}.json`;
  await writeFile(join(OUTBOX, name), `${JSON.stringify({ ...message, ...extra }, null, 2)}\n`);
  return name;
}

export async function deliver(message) {
  const apiKey = process.env.MAIL_PROVIDER_API_KEY;

  if (!apiKey) {
    const file = await writeToOutbox(message, { delivery: 'outbox (nessun provider configurato)' });
    return { sent: false, queued: true, file };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: message.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
    });
    if (!res.ok) throw new Error(`provider HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    return { sent: true, id: data.id ?? null };
  } catch (err) {
    // Fallback: il messaggio non va perso, resta pronto per il reinvio.
    const file = await writeToOutbox(message, { delivery: `fallita: ${err.message}` });
    return { sent: false, queued: true, file, error: err.message };
  }
}

const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/**
 * Riepilogo email della giocata registrata, nella lingua usata per giocare:
 * chi ha compilato il form in inglese non deve ricevere una conferma in italiano.
 */
export function entryReceivedTemplate(entry) {
  const locale = entry.locale === 'en' ? 'en' : 'it';
  const dict = getDictionary(locale);
  const t = dict.email;
  const drawDate = new Date(CONTEST.drawDate).toLocaleDateString(intlLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const winners = PRIZES.users.winners + PRIZES.merchants.winners;

  const rows = [
    [t.rowId, entry.id],
    [t.rowTx, entry.txIdMasked],
    entry.merchant ? [t.rowMerchant, entry.merchant] : null,
    [t.rowReceipt, entry.receipt?.originalName ?? entry.receiptName ?? t.yes],
    [t.rowDate, entry.createdAtLabel],
    [t.rowStatus, t.statusValue],
  ].filter(Boolean);

  const text = [
    t.greeting,
    '',
    t.intro(dict.meta.contestTitle, EVENT.name, EVENT.city),
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    t.nextTitle.toUpperCase(),
    ...t.next(drawDate).map((line, i) => `${i + 1}. ${line}`),
    '',
    t.pool(formatXaut(TOTAL_POOL), winners),
    '',
    `${t.warningLead}${t.warning(CONTEST.organizer)}`,
    '',
    t.support(CONTEST.supportEmail),
  ].join('\n');

  const html = `<!doctype html>
<html lang="${locale}"><body style="margin:0;background:#0F0F12;font-family:-apple-system,Segoe UI,sans-serif;color:#fff">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F12;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#16161B;border:1px solid rgba(255,255,255,.1);border-radius:16px;overflow:hidden">
        <tr><td style="padding:28px 28px 0">
          <p style="margin:0;font-size:12px;letter-spacing:3px;color:#FFD700;font-weight:700">${esc(CONTEST.organizer)}</p>
          <h1 style="margin:12px 0 0;font-size:22px;line-height:1.3">${esc(t.heading)}</h1>
          <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:#A1A1AA">
            ${esc(t.intro(dict.meta.contestTitle, EVENT.name, EVENT.city))}
          </p>
        </td></tr>
        <tr><td style="padding:24px 28px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px">
            ${rows
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:9px 0;color:#A1A1AA;border-bottom:1px solid rgba(255,255,255,.06)">${esc(k)}</td>
                   <td align="right" style="padding:9px 0;font-weight:600;border-bottom:1px solid rgba(255,255,255,.06)">${esc(v)}</td></tr>`
              )
              .join('')}
          </table>
        </td></tr>
        <tr><td style="padding:24px 28px 0">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700">${esc(t.nextTitle)}</p>
          <p style="margin:0;font-size:13px;line-height:1.7;color:#A1A1AA">
            ${t
              .next(drawDate)
              .map((line, i) => `${i + 1}. ${esc(line)}`)
              .join('<br>')}
          </p>
        </td></tr>
        <tr><td style="padding:22px 28px 0">
          <p style="margin:0;padding:14px;border:1px solid rgba(255,215,0,.3);background:rgba(255,215,0,.07);border-radius:12px;font-size:12px;line-height:1.6;color:#A1A1AA">
            <strong style="color:#FFD700">${esc(t.warningLead)}</strong>${esc(t.warning(CONTEST.organizer))}
          </p>
        </td></tr>
        <tr><td style="padding:22px 28px 28px">
          <p style="margin:0;font-size:11px;color:#71717A">
            ${esc(t.support(CONTEST.supportEmail)).replace(
              esc(CONTEST.supportEmail),
              `<a href="mailto:${esc(CONTEST.supportEmail)}" style="color:#FFD700">${esc(CONTEST.supportEmail)}</a>`
            )}<br>
            ${esc(t.footer(CONTEST.organizer))}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return {
    template: 'entry-received',
    locale,
    to: entry.email,
    from: FROM,
    subject: t.subject(entry.id, dict.meta.contestTitle),
    text,
    html,
  };
}

/** Conferma di registrazione della giocata (stato: in verifica). */
export const sendEntryReceived = (entry) => deliver(entryReceivedTemplate(entry));
