/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta basada en la identidad visual de KAVOD (Lujo, Negro, Plata, Oro)
        kavod: {
          black: '#050505',      // Fondo principal ultra oscuro
          dark: '#121212',       // Fondo secundario / tarjetas
          gray: '#2a2a2a',       // Bordes sutiles y fondos terciarios
          silver: '#c0c0c0',     // Textos secundarios y detalles metálicos
          gold: '#d4af37',       // Acentos de lujo, botones, iconos
          white: '#ffffff',      // Textos principales
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        // Gradientes metálicos para los detalles en los bordes
        'metal-gradient': 'linear-gradient(135deg, #2a2a2a 0%, #c0c0c0 50%, #2a2a2a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #b8860b 0%, #d4af37 50%, #b8860b 100%)',
      }
    },
  },
  plugins: [],
}