import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/server/rilevazioni-auth';
import { receiptOf } from '@/lib/server/entries-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** La foto dello scontrino di una giocata (?id=NK-…), solo per l'admin. */
export async function GET(request) {
  if (!isAdmin(request)) return NextResponse.json({ code: 'forbidden' }, { status: 403 });
  const file = await receiptOf(new URL(request.url).searchParams.get('id') ?? '');
  if (!file) return NextResponse.json({ code: 'not_found' }, { status: 404 });
  return new NextResponse(file.body, {
    headers: { 'Content-Type': file.contentType, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}
