import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f472b6',
          400: '#ec4899',
          500: '#db2777',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#831843',
          950: '#4c0519',
        },
        navy: {
          800: '#26071d',
          900: '#160312',
          950: '#0c010a',
        },
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
        },
        ticket: {
          pink: '#e11d48',
          pinkDark: '#be123c',
          pinkLight: '#fdf2f8',
          blue: '#e11d48',
          blueDark: '#be123c',
          blueLight: '#fdf2f8',
          paper: '#ffffff',
          cream: '#ffffff',
          navy: '#160312',
          amber: '#f59e0b',
        },
        verified: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(225, 29, 72, 0.05), 0 1px 3px rgba(11, 17, 32, 0.04)',
        'card-hover': '0 16px 36px -4px rgba(225, 29, 72, 0.12), 0 4px 12px -2px rgba(11, 17, 32, 0.05)',
        elevated: '0 24px 50px -10px rgba(76, 5, 25, 0.18), 0 6px 18px -2px rgba(11, 17, 32, 0.08)',
        ticket: '0 24px 56px -8px rgba(225, 29, 72, 0.18), 0 4px 16px -2px rgba(11, 17, 32, 0.06)',
        'glow-brand': '0 0 24px rgba(225, 29, 72, 0.28)',
        'glow-emerald': '0 0 24px rgba(16, 185, 129, 0.28)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        pageEnter: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 98, 224, 0.25)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0, 98, 224, 0)' },
        },
        mjPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.9' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'page-enter': 'pageEnter 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 0.2s ease-out both',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'mj-pulse': 'mjPulse 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
