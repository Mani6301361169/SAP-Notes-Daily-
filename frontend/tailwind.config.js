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
        fiori: {
          shellbar: '#354a5f',
          shellbarDark: '#1d232a',
          primary: '#0a6ed1',
          primaryHover: '#0854a0',
          bgLight: '#f5f6f8',
          bgDark: '#12161a',
          cardLight: '#ffffff',
          cardDark: '#1e242b',
          borderLight: '#e2e8f0',
          borderDark: '#2d3748',
          success: '#107e3e',
          danger: '#bb0000',
          warning: '#e69a00',
          info: '#1b74e4'
        }
      },
      fontFamily: {
        sans: ['72', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['72-Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        fiori: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        fioriHover: '0 8px 16px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
