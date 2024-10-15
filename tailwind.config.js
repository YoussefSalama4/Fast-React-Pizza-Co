/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: 'Roboto Mono, monospace',
    },

    extend: {
      colors: {
        pizza: '#123456',
      },
      height: {
        screen: '100dvh',
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        '@media (max-width: 400px)': {
          html: { fontSize: '80%' },
        },
        '@media (max-width: 350px)': {
          html: { fontSize: '70%' },
        },
        '@media (max-width: 250px)': {
          html: { fontSize: '55%' },
        },
      });
    },
  ],
};
