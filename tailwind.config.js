/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Crimson Pro', 'Noto Serif', 'Georgia', 'Times New Roman', 'serif'],
        scripture: ['Crimson Pro', 'Noto Serif', 'Georgia', 'serif'],
        hebrew: ['Noto Sans Hebrew', 'SBL Hebrew', 'Ezra SIL', 'serif'],
        greek: ['Noto Serif', 'SBL Greek', 'Gentium Plus', 'serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        scripture: {
          bg: '#faf8f5',
          'bg-dark': '#1a1814',
          text: '#2c2416',
          'text-dark': '#e8e4dd',
          accent: '#8b7355',
          highlight: '#f5e6c8',
          'highlight-dark': '#3d3526',
        },
        parchment: {
          50: '#fdfcfa',
          100: '#faf8f5',
          200: '#f5f0e8',
          300: '#ebe3d6',
          400: '#d9ccb8',
          500: '#c4b39a',
          600: '#a69076',
          700: '#8b7355',
          800: '#6d5a44',
          900: '#4a3d2e',
        },
      },
      fontSize: {
        'scripture-sm': ['1rem', { lineHeight: '1.75' }],
        'scripture': ['1.125rem', { lineHeight: '1.9', letterSpacing: '0.015em' }],
        'scripture-lg': ['1.25rem', { lineHeight: '2', letterSpacing: '0.015em' }],
        'scripture-xl': ['1.375rem', { lineHeight: '2.1', letterSpacing: '0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'scripture': '0 4px 20px -2px rgba(139, 115, 85, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'slide-up-fade': 'slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUpFade: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2) drop-shadow(0 0 10px rgba(168,85,247,0.4))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
