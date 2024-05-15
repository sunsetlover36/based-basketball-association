/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        nh: {
          raw: '(min-height: 900px)',
        },
      },
    },
  },
  plugins: [],
};
