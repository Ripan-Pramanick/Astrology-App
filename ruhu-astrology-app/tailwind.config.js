/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a2c4e',
        primaryDark: '#0f1e36',
        accent: '#d4af37',
        accentDark: '#b8941e',
        background: '#fef9f0',
        cream: '#fff9ef',
        textDark: '#2d2d2d',
        textLight: '#6b6b6b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}