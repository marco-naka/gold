import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { isAdmin } from '@/lib/server/rilevazioni-auth';
import { photoFiles, stickerPhotoPath, stickersFileBytes } from '@/lib/server/stickers';
import { zipStore } from '@/lib/server/zip';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Copia di sicurezza dell'area adesivi, per l'admin: tutte le foto sul disco e il file dei
 * passaggi (chi, quando, cosa ha lasciato), in un solo ZIP da tenere sul computer.
 */
export async function GET(request) {
  if (!isAdmin(request)) return NextResponse.json({ code: 'forbidden' }, { status: 403 });
  const files = [];
  const json = await stickersFileBytes();
  if (json) files.push({ name: 'adesivi.json', data: json });
  for (const key of await photoFiles()) {
    try {
      files.push({ name: key, data: await readFile(stickerPhotoPath(key)) });
    } catch {
      /* un file sparito tra l'elenco e la lettura: gli altri vanno lo stesso */
    }
  }
  const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
  return new NextResponse(zipStore(files), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="adesivi-copia-${stamp}.zip"`,
      'Cache-Control': 'no-store',
    },
  });
}
