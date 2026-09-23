/**
 * Wallet Lightning consigliati dal circuito Plan ₿ Lugano per pagare in BTC/USD₮ in città
 * (fonte: planb.lugano.ch/paga-in-cripto). I link puntano ai tutorial ufficiali Plan ₿ Network.
 */
export const WALLETS = [
  {
    name: 'Bitkit',
    desc: 'Wallet Lightning self-custodial, semplice da avviare.',
    url: 'https://planb.network/en/tutorials/wallet/mobile/bitkit-wallet-a7224674-85c4-4045-9baf-37018d89550c',
  },
  {
    name: 'Breez',
    desc: 'Pagamenti Lightning istantanei, adatto ai pagamenti in negozio.',
    url: 'https://planb.network/en/tutorials/wallet/mobile/breez-46a6867b-c74b-45e7-869c-10a4e0263c06',
  },
  {
    name: 'Wallet of Satoshi',
    desc: 'Custodial, il più rapido da configurare per chi inizia oggi.',
    url: 'https://planb.network/en/tutorials/wallet/mobile/wallet-of-satoshi-39149d86-e42b-4e8f-ae9f-7e061e7784f7',
  },
];

export const LIGHTNING_COURSE =
  'https://planb.network/en/courses/a804c4b6-9ff5-4a29-a530-7d2f5d04bb7a/introduction-to-the-lightning-network-c095c7ad-5469-4c7b-9510-b6c0b86244e7';

/**
 * Guida ufficiale "Pagare in criptovalute" del circuito Plan ₿ Lugano: spiega come si paga sui POS
 * degli esercenti, quali asset sono accettati e come procurarsi BTC/USD₮ in città.
 * La pagina è costruita con Elementor e non espone anchor stabili (gli id sono hash rigenerati a
 * ogni modifica): si linka quindi la pagina intera, non una sua sezione.
 */
export const OFFICIAL_GUIDE = {
  it: 'https://planb.lugano.ch/paga-in-cripto/?lang=it',
  en: 'https://planb.lugano.ch/pay-in-crypto/',
};

export const MYLUGANO_URL = 'https://my.lugano.ch/';
