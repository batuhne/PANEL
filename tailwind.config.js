/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#81C784',
      },
      borderRadius: {
        'button': '8px',
        'card': '12px',
      },
      fontFamily: {
        'logo': ['Pacifico', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      }
    },
  },
  plugins: [],
}
