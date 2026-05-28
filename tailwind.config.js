/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f7f8',
          100: '#e9eaec',
          200: '#c8cbd1',
          300: '#9da1ab',
          400: '#71757f',
          500: '#52555d',
          600: '#3a3c43',
          700: '#26282d',
          800: '#17181c',
          900: '#0f1013',
          950: '#0a0a0b',
        },
        court: {
          padel: '#1e6f5c',
          padelLine: '#f4f1e8',
          tennis: '#2563aa',
          tennisLine: '#f4f1e8',
          clay: '#b95a3a',
        },
        accent: {
          DEFAULT: '#7af7c8',
          glow: '#34d399',
          warn: '#fb923c',
          danger: '#ef4444',
          info: '#60a5fa',
        },
        team: {
          home: '#7af7c8',
          homeBorder: '#10b981',
          away: '#fb7185',
          awayBorder: '#f43f5e',
        },
      },
      fontFamily: {
        sans: [
          '"Inter Variable"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(122, 247, 200, 0.25), 0 12px 32px -8px rgba(122, 247, 200, 0.35)',
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
}
