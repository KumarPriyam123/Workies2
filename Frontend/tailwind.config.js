/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0f0f0f',
        'card-bg': 'rgba(255, 255, 255, 0.05)',
        'text-primary': '#ffffff',
        'text-secondary': 'rgba(255, 255, 255, 0.6)',
        'accent-purple': '#8b5cf6',
        'accent-blue': '#3b82f6',
        'accent-green': '#10b981',
        'accent-teal': '#14b8a6',
      },
    },
  },
  plugins: [],
} 