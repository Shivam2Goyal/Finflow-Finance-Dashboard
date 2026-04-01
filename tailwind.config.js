/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f5f3ef', 100: '#e8e4db', 200: '#d4cec0', 300: '#b8af99',
          400: '#9a8f74', 500: '#7d7259', 600: '#635a46', 700: '#4e4638',
          800: '#3a3429', 900: '#1e1b14', 950: '#0f0e0a',
        },
        gold: { 300: '#fcd97a', 400: '#f9c840', 500: '#f0a500', 600: '#c87d00' },
        jade: { 400: '#4ade80', 500: '#22c55e', 600: '#16a34a' },
        ruby: { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
        sapphire: { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb' },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
