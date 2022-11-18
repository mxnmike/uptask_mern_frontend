/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        betterhover: { raw: '(hover: hover)' },
      },
    },
  },
  plugins: [],
}
