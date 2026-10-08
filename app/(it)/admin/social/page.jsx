import { redirect } from 'next/navigation';

/** Indirizzo di prima: il pannello dei link social ora sta con gli altri, sotto /rilevazioni/admin. */
export default function Page() {
  redirect('/rilevazioni/admin/social');
}
