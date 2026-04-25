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
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb',    // blue-600
        },
        secondary: {
          DEFAULT: '#8b5cf6', // violet-500
          dark: '#7c3aed',    // violet-600
        },
        success: '#10b981',   // emerald-500
        active: '#f59e0b',    // amber-500
        error: '#ef4444',     // red-500
        background: {
          DEFAULT: '#0f172a', // slate-900
          light: '#1e293b',   // slate-800
          lighter: '#334155', // slate-700
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
