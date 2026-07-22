/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiss: {
          bg: '#f2f2f2',
          text: '#111111',
          muted: '#b6b5b5',
          darkgray: '#838282',
          card: '#ffffff',
          accent: '#111111',
        },
        softly: {
          bg: '#FDFCF8',
          text: '#2A2825',
          sage: '#606C56',
          peach: '#DD8D6B',
          lavender: '#D1C4E9',
          sand: '#EFECE5',
          accent: '#606C56',
        }
      },
      fontFamily: {
        clash: ['Clash Display', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        reenie: ['Reenie Beanie', 'cursive'],
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
