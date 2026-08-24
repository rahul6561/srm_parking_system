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
        srm: {
          blue: '#002B49',
          gold: '#FFB81C',
          navy: '#0B192C',
          dark: '#080E1A',
          card: '#0F1E36',
          border: '#1E355B',
          accent: '#1E40AF',
          cyan: '#06B6D4'
        },
        status: {
          available: '#10B981', // Emerald green
          limited: '#F59E0B',   // Amber yellow
          full: '#EF4444',      // Rose red
          offline: '#64748B'    // Slate gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
