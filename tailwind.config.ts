import type { Config } from 'tailwindcss';

/**
 * "Midnight & Gilt" — the VA Decants luxury design system.
 * Colors are surfaced as both Tailwind tokens and (in globals.css) CSS variables.
 * Gold is an ACCENT only: hairlines, small type, frames — never large fills.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0B0B0F', // page background (near-black, slight blue)
          850: '#111017', // app chrome / footer
          800: '#16151D', // card surface
          700: '#1F1E28', // raised surface, inputs, hover
          600: '#2A2935', // borders, dividers
        },
        gold: {
          700: '#8C6F33',
          500: '#C9A24B', // primary accent
          400: '#D9B978',
          300: '#E7CE9A', // links / accent text on dark
        },
        champagne: '#F4E9D2', // display headings
        paper: '#EFEAE0', // primary body text
        muted: {
          DEFAULT: '#A9A39A',
          2: '#76726C',
        },
        success: '#7FB069',
        warn: '#D98E4A',
        danger: '#C8553D',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '14px',
      },
      boxShadow: {
        soft: '0 20px 50px -24px rgba(0,0,0,0.7)',
        glow: '0 0 0 1px rgba(201,162,75,0.35), 0 8px 30px -12px rgba(201,162,75,0.25)',
      },
      letterSpacing: {
        label: '0.18em',
      },
      maxWidth: {
        container: '1280px',
      },
      keyframes: {
        'fade-rise': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-rise': 'fade-rise 0.5s cubic-bezier(0.2,0.7,0.2,1) both',
        sheen: 'sheen 0.6s cubic-bezier(0.2,0.7,0.2,1)',
        shimmer: 'shimmer 1.6s linear infinite',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.2,0.7,0.2,1)',
      },
    },
  },
  plugins: [],
};

export default config;
