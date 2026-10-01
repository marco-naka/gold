/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F0F12',
          deep: '#0D0D0D',
          soft: '#16161B',
          line: '#26262E',
        },
        gold: {
          DEFAULT: '#FFD700',
          warm: '#F3BA2F',
          deep: '#B8860B',
        },
        /*
         * L'arancio ufficiale di Bitcoin (#F7931A). È il colore della campagna CLIENTI: chi
         * paga vince satoshi. L'oro resta quello dei COMMERCIANTI. Tenere due accenti distinti
         * non è decorazione — dice a colpo d'occhio di quale dei due montepremi si sta parlando.
         */
        btc: {
          DEFAULT: '#F7931A',
          warm: '#FFB347',
          deep: '#C4700F',
        },
        muted: '#A1A1AA',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(120deg, #F3BA2F 0%, #FFD700 45%, #FFF3B0 60%, #F3BA2F 100%)',
        'btc-gradient': 'linear-gradient(120deg, #C4700F 0%, #F7931A 45%, #FFC178 60%, #F7931A 100%)',
        'gold-sheen': 'linear-gradient(120deg, transparent 20%, rgba(255,255,255,.55) 50%, transparent 80%)',
      },
      boxShadow: {
        gold: '0 10px 40px -12px rgba(243, 186, 47, 0.45)',
        'gold-sm': '0 4px 20px -8px rgba(243, 186, 47, 0.5)',
        btc: '0 10px 40px -12px rgba(247, 147, 26, 0.5)',
        'btc-sm': '0 4px 20px -8px rgba(247, 147, 26, 0.55)',
      },
      keyframes: {
        sheen: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.35)' },
          '70%': { boxShadow: '0 0 0 14px rgba(255, 215, 0, 0)' },
        },
        pulseBtc: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(247, 147, 26, 0.4)' },
          '70%': { boxShadow: '0 0 0 14px rgba(247, 147, 26, 0)' },
        },
      },
      animation: {
        sheen: 'sheen 2.6s ease-in-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        'fade-up': 'fade-up .6s ease-out both',
        'scale-in': 'scale-in .25s ease-out both',
        'pulse-gold': 'pulseGold 2.4s infinite',
        'pulse-btc': 'pulseBtc 2.4s infinite',
      },
    },
  },
  plugins: [],
};
