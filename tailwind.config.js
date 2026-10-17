/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#07110D',
          secondary: '#0B1711',
          card: '#102019',
          elevated: '#152920',
        },
        accent: {
          primary: '#22C55E',
          secondary: '#10B981',
          hover: '#4ADE80',
          dim: 'rgba(34, 197, 94, 0.12)',
        },
        border: {
          DEFAULT: '#20382B',
          subtle: '#182C22',
          highlight: '#2E523F',
        },
        content: {
          primary: '#F0FDF4',
          secondary: '#A7B9AD',
          muted: '#6C8375',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(34, 197, 94, 0.15)',
        'glow-md': '0 0 25px -5px rgba(34, 197, 94, 0.2)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(34, 197, 94, 0.12) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
