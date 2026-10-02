import { notFound } from 'next/navigation';

/** Indirizzo sconosciuto sotto /en: la 404 del sito, in inglese (vedi la gemella in app/(it)). */
export default function CatchAll() {
  notFound();
}
