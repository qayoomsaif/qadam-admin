/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F2F2F2',
        'primary-blue': {
          500: '#001662',
          600: '#001459',
          300: '#546396',
        },
        'neutral-gray': {
          500: '#787878',
          900: '#323232',
        },
        'accent-orange': {
          500: '#FE5000',
        },
        'primary-grey': {
          500: '#D5D5D5',
        },
      },
    },
  },
  plugins: [],
}
