import { blackA } from '@radix-ui/colors';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ember: ['var(--font-ember)'],
      },
      colors: {
        ...blackA,
      },
      keyframes: {
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        overlayHide: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        contentShow: {
          from: {
            transform: 'translate(0%, 100%)',
          },
          to: { transform: 'translate(0%, 0%)' },
        },
        contentHide: {
          from: { transform: 'translate(0%, 0%)' },
          to: {
            transform: 'translate(0%, 100%)',
          },
        },
      },
      animation: {
        overlayShow: 'overlayShow 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        overlayHide: 'overlayHide 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentHide: 'contentHide 500ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

module.exports = config;
