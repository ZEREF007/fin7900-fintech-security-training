/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e8ff',
          200: '#c4d3ff',
          300: '#98b1ff',
          400: '#6484ff',
          500: '#4158f5',
          600: '#2f3dee',
          700: '#1e29d3',
          800: '#1822ab',
          900: '#141f8a',
          950: '#0f1260',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f1260 0%, #1e29d3 50%, #7c3aed 100%)',
        'card-gradient': 'linear-gradient(135deg, #f0f4ff 0%, #e8f4fd 100%)',
      },
    },
  },
  plugins: [],
}
