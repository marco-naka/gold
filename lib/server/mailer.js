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

/** Riepilogo email della giocata registrata. */
export function entryReceivedTemplate(entry) {
  const rows = [
    ['ID giocata', entry.id],
    ['Numero transazione', entry.txIdMasked],
    entry.merchant ? ['Negozio', entry.merchant] : null,
    ['Scontrino allegato', entry.receipt?.originalName ?? entry.receiptName ?? 'sì'],
    ['Registrata il', entry.createdAtLabel],
    ['Stato', 'In verifica sul backend POS NAKA'],
  ].filter(Boolean);

  const text = [
    'Ciao,',
    '',
    `abbiamo registrato la tua partecipazione al concorso "${CONTEST.title}" — ${EVENT.name}, ${EVENT.city}.`,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'CHE COSA SUCCEDE ORA',
    '1. Verifichiamo la transazione confrontandola con i dati registrati sul POS NAKA.',
    '2. Ricevi una seconda email quando la giocata è convalidata.',
    `3. Il ${new Date(CONTEST.drawDate).toLocaleDateString('it-CH')} si tiene l'estrazione pubblica.`,
    '',
    `In palio ${formatXaut(TOTAL_POOL)} in Tether Gold, per un totale di ${PRIZES.users.winners + PRIZES.merchants.winners} premi.`,
    '',
    'IMPORTANTE: conserva lo scontrino originale fino alla comunicazione dei vincitori.',
    'In caso di vincita ti scriveremo a questo indirizzo e ti chiederemo il wallet su cui accreditare il premio in XAUT: NAKA non chiede mai chiavi private o frasi di recupero.',
    '',
    `Per assistenza: ${CONTEST.supportEmail}`,
  ].join('\n');

  const html = `<!doctype html>
<html lang="it"><body style="margin:0;background:#0F0F12;font-family:-apple-system,Segoe UI,sans-serif;color:#fff">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F12;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#16161B;border:1px solid rgba(255,255,255,.1);border-radius:16px;overflow:hidden">
        <tr><td style="padding:28px 28px 0">
          <p style="margin:0;font-size:12px;letter-spacing:3px;color:#FFD700;font-weight:700">${esc(CONTEST.organizer)}</p>
          <h1 style="margin:12px 0 0;font-size:22px;line-height:1.3">Giocata registrata</h1>
          <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:#A1A1AA">
            Abbiamo ricevuto la tua partecipazione a &laquo;${esc(CONTEST.title)}&raquo; — ${esc(EVENT.name)}, ${esc(EVENT.city)}.
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
          <p style="margin:0 0 8px;font-size:13px;font-weight:700">Che cosa succede ora</p>
          <p style="margin:0;font-size:13px;line-height:1.7;color:#A1A1AA">
            1. Verifichiamo la transazione sul POS NAKA.<br>
            2. Ricevi una seconda email alla convalida della giocata.<br>
            3. Estrazione pubblica il ${esc(new Date(CONTEST.drawDate).toLocaleDateString('it-CH'))}.
          </p>
        </td></tr>
        <tr><td style="padding:22px 28px 0">
          <p style="margin:0;padding:14px;border:1px solid rgba(255,215,0,.3);background:rgba(255,215,0,.07);border-radius:12px;font-size:12px;line-height:1.6;color:#A1A1AA">
            <strong style="color:#FFD700">Conserva lo scontrino originale</strong> fino alla comunicazione dei vincitori.
            In caso di vincita ti chiederemo il wallet su cui ricevere il premio: ${esc(CONTEST.organizer)} non chiede mai
            chiavi private o frasi di recupero.
          </p>
        </td></tr>
        <tr><td style="padding:22px 28px 28px">
          <p style="margin:0;font-size:11px;color:#71717A">
            Assistenza: <a href="mailto:${esc(CONTEST.supportEmail)}" style="color:#FFD700">${esc(CONTEST.supportEmail)}</a><br>
            © 2026 ${esc(CONTEST.organizer)}. Premi erogati in Tether Gold (XAUT); il controvalore può variare.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return {
    template: 'entry-received',
    to: entry.email,
    from: FROM,
    subject: `Giocata ${entry.id} registrata — ${CONTEST.title}`,
    text,
    html,
  };
}

/** Conferma di registrazione della giocata (stato: in verifica). */
export const sendEntryReceived = (entry) => deliver(entryReceivedTemplate(entry));
