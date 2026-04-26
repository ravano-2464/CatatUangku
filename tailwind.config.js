/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#14b8a6',
          700: '#0f766e',
        },
        income: '#16a34a',
        expense: '#dc2626',
      },
    },
  },
  plugins: [],
};
