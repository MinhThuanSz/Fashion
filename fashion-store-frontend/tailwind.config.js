/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9', // Nova Blue (Cyan 500)
          hover: '#0284c7',
        },
        secondary: '#f97316', // Solar Orange (Orange 500)
        black: '#0a0a0a',
        dark: {
          900: '#000000',
          800: '#111111',
          700: '#1a1a1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
          'xl': '1rem',
          '2xl': '1.5rem',
          '3xl': '2rem',
      },
      animation: {
          'fade-in': 'fade-in 0.3s ease-out',
          'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          'slide-right': 'slide-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
          'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          'slide-up': {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          'slide-right': {
            '0%': { transform: 'translateX(-100%)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          }
      }
    },
  },
  plugins: [],
}
