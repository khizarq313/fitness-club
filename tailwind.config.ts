import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#141414',
        'surface-elevated': '#1A1A1A',
        'surface-high': '#222222',
        primary: '#F5A623',
        'primary-container': '#C47D0E',
        'on-primary': '#000000',
        outline: '#2A2A2A',
        'on-surface': '#FFFFFF',
        'on-surface-variant': '#A0A0A0',
      },
      fontFamily: {
        display: ['Bebas Neue', 'cursive'],
        headline: ['Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
      },
      transitionTimingFunction: {
        'vault': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245, 166, 35, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(245, 166, 35, 0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'grain': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '30%': { transform: 'translate(3%, -15%)' },
          '50%': { transform: 'translate(-8%, 5%)' },
          '70%': { transform: 'translate(8%, -5%)' },
          '90%': { transform: 'translate(-3%, 10%)' },
        },
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'grain': 'grain 8s steps(10) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
