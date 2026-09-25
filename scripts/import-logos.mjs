#!/usr/bin/env node
/**
 * Scarica i loghi dei merchant e li ospita in proprio.
 *
 *   npm run import:logos
 *
 * Nella sorgente i loghi stanno su un bucket S3 di terze parti: usarli via URL rimetterebbe
 * una richiesta esterna per ogni scheda visitata, cioè esattamente ciò che abbiamo eliminato
 * ospitando i font. Qui vengono scaricati una volta, ridotti a 128 px e convertiti in WebP —
 * gli originali vanno da 4 KB a oltre mezzo megabyte, improponibili in un elenco di 336 schede.
 */
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SNAPSHOT = join(ROOT, 'lib', 'merchants.data.json');
const OUT_DIR = join(ROOT, 'public', 'img', 'merchants');
const ENDPOINT = 'https://planb.lugano.ch/wp-json/bfx-crypto-map/v1/merchants?env=production';
const SIZE = 128;

const exists = (path) => stat(path).then(() => true).catch(() => false);

async function main() {
  const snapshot = JSON.parse(await readFile(SNAPSHOT, 'utf8'));
  const res = await fetch(ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Endpoint non disponibile: HTTP ${res.status}`);
  const { items = [] } = await res.json();

  // Il collegamento fra snapshot e sorgente è il nome, l'unico campo che abbiamo conservato.
  const bySource = new Map(items.filter((i) => i.logo_url).map((i) => [i.title.trim().toLowerCase(), i.logo_url]));

  await mkdir(OUT_DIR, { recursive: true });
  let downloaded = 0;
  let reused = 0;
  let failed = 0;
  let bytes = 0;

  for (const merchant of snapshot.merchants) {
    const source = bySource.get(merchant.name.trim().toLowerCase());
    if (!source) continue;

    const file = `${merchant.id}.webp`;
    const path = join(OUT_DIR, file);

    if (await exists(path)) {
      merchant.logo = `/img/merchants/${file}`;
      bytes += (await stat(path)).size;
      reused += 1;
      continue;
    }

    try {
      const img = await fetch(source, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!img.ok) throw new Error(`HTTP ${img.status}`);
      const buffer = Buffer.from(await img.arrayBuffer());

      // `fit: inside` non ritaglia: un logo largo resta leggibile, non viene tagliato a metà.
      const out = await sharp(buffer)
        .resize(SIZE, SIZE, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      await writeFile(path, out);
      merchant.logo = `/img/merchants/${file}`;
      bytes += out.length;
      downloaded += 1;
    } catch (err) {
      // Un logo mancante non è un problema: la scheda mostra l'iniziale del nome.
      failed += 1;
      process.stderr.write(`  ⚠ ${merchant.name}: ${err.message}\n`);
    }
  }

  snapshot.logosImportedAt = new Date().toISOString();
  await writeFile(SNAPSHOT, `${JSON.stringify(snapshot, null, 2)}\n`);

  const withLogo = snapshot.merchants.filter((m) => m.logo).length;
  process.stdout.write(
    `✓ ${withLogo} merchant con logo (${downloaded} scaricati, ${reused} già presenti, ${failed} non riusciti)\n` +
      `  peso complessivo: ${Math.round(bytes / 1024)} KB · media ${Math.round(bytes / Math.max(1, withLogo) / 1024)} KB\n`
  );
}

main().catch((err) => {
  process.stderr.write(`✗ ${err.message}\n`);
  process.exit(1);
});
