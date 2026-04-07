/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A1628',
        'navy-mid': '#122040',
        teal: '#00B5A3',
        'teal-light': '#00D4BF',
        gold: '#F5A623',
        slate: '#64748B',
        success: '#22C55E'
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif']
      }
    }
  },
  plugins: []
};
