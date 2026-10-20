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
          secondary: '#0D1B14',
          surface: '#0D1B14',
          card: '#0D1B14',
          elevated: '#12251A',
          'surface-secondary': '#12251A',
        },
        surface: {
          DEFAULT: '#0D1B14',
          secondary: '#12251A',
        },
        accent: {
          primary: '#16A34A',
          secondary: '#16A34A',
          neon: '#4ADE80',
          hover: '#4ADE80',
          dim: 'rgba(74, 222, 128, 0.12)',
        },
        border: {
          DEFAULT: '#243A2C',
          subtle: '#182C22',
          highlight: '#243A2C',
        },
        content: {
          primary: '#F3F7F4',
          secondary: '#A1B5A8',
          muted: '#6C8375',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(74, 222, 128, 0.15)',
        'glow-md': '0 0 25px -5px rgba(74, 222, 128, 0.2)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(74, 222, 128, 0.12) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
