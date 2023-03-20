/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ember: ['var(--font-ember)'],
      },
    },
  },
  plugins: [],
};

module.exports = config;
