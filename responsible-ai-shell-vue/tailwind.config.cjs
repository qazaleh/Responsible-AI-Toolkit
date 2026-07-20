/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 24px 60px rgba(14, 165, 233, 0.18)'
      },
      colors: {
        ink: '#03111f',
        aurora: '#0ea5e9',
        ember: '#f97316',
        moss: '#22c55e'
      }
    }
  },
  plugins: []
};
