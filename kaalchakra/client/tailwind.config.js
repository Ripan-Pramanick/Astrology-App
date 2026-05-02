// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold-dark': '#b8860b',
        'gold': '#d4af37',
        'gold-light': '#e6b34c',
        'orange-brand': '#F7931E',
        'orange-light': '#f4a460',
        'amber-brand': '#f59e0b',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #b8860b, #d4af37)',
        'gradient-orange': 'linear-gradient(135deg, #F7931E, #f4a460)',
        'gradient-sunset': 'linear-gradient(135deg, #F7931E, #f4a460, #e6b34c)',
        'gradient-cosmic': 'linear-gradient(135deg, #1a0b2e, #2d1b4e, #4c1d95)',
      },
    },
  },
  plugins: [],
}