/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      fontFamily:{
        sans:["Inter","sans-serif"]
      },

      boxShadow:{
        cyan:"0 0 40px rgba(34,211,238,.18)"
      }
    },
  },

  plugins: [],
}