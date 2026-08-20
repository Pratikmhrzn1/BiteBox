/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAD388',
        amber: '#FFC93C',
        olive: '#8C9A09',
        'espresso-dark': '#303411',
        brown: '#7D4A37',
        'accent-red': '#E8452C',
        'burnt-orange': '#D25F26',
        'card-bg': '#FFF6E9',
        'ink-dark': '#241A12',
        'ink-muted': '#7A6A5C',
        'header-brown': '#4A2A18',
      },
      fontFamily: {
        display: ['Luckiest Guy', 'cursive'],
        titan: ['Titan One', 'cursive'],
        script: ['Caveat', 'cursive'],
        sans: ['Fredoka', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}