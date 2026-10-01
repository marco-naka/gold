/**
 * Riduzione delle foto prima del caricamento, nel browser.
 *
 * Uno scatto da telefono pesa 2–5 MB. Con 336 negozi e tre o quattro foto ciascuno si
 * arriva a quattro gigabyte: più del disco che li dovrebbe ospitare, e minuti di attesa
 * per il rilevatore che carica con la rete mobile dentro un negozio.
 *
 * Portati a 1600 px sul lato lungo e salvati in JPEG, gli stessi scatti pesano ~300 KB.
 * Una vetrina o una ricevuta restano perfettamente leggibili: 1600 px sono più del doppio
 * della risoluzione a cui verranno guardati.
 *
 * Non fallisce mai in modo distruttivo: se il browser non sa decodificare l'immagine —
 * capita con certi HEIC — si carica il file originale così com'è.
 */

const MAX_SIDE = 1600;
const QUALITY = 0.82;
/** Sotto questa soglia comprimere non vale il rischio di degradare: si tiene l'originale. */
const SKIP_BELOW = 400 * 1024;

const canDecode = (file) => file?.type?.startsWith('image/');

export async function compressImage(file) {
  if (!file || !canDecode(file) || file.size < SKIP_BELOW) return file;

  try {
    // `imageOrientation: 'from-image'` applica la rotazione EXIF: senza, le foto scattate
    // in verticale arrivano coricate.
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY));
    if (!blob || blob.size >= file.size) return file; // già più piccola dell'originale: si tiene

    const name = file.name.replace(/\.[^.]+$/, '') || 'foto';
    return new File([blob], `${name}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  }
}

/** Comprime più file in parallelo, mantenendo l'ordine di selezione. */
export const compressAll = (files) => Promise.all(files.map(compressImage));
