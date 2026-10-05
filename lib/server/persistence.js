/**
 * Il disco su cui scriviamo sopravvive a deploy e riavvii?
 *
 * Su Render solo se c'è un disco montato e `DATA_DIR` punta lì: la cartella del progetto si
 * azzera a ogni deploy, e sul piano gratuito anche quando il servizio va in pausa. Scriverci
 * vuol dire accettare dati e perderli senza che nessuno se ne accorga.
 *
 * In locale (`next dev`, test) `.data` non sparisce da sola: vale come persistente.
 */
export const persistentStorage = () => Boolean(process.env.DATA_DIR) || process.env.NODE_ENV !== 'production';
