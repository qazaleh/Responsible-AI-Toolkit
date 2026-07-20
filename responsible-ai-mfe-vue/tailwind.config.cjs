/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      boxShadow: {
        aurora: '0 30px 80px rgba(14, 165, 233, 0.15)'
      },
      colors: {
        surf: '#061120',
        tide: '#0f172a',
        mist: '#cbd5e1',
        flame: '#fb923c',
        mint: '#34d399'
      }
    }
  },
  plugins: []
};
