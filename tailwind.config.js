/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/views/**/*.ejs',
  ],
  theme: {
    extend: {
      colors: {
        // Identidade visual Violinha — ver specs.md seção 9.1
        marinho: '#0f172a', // header, footer
        ambar: '#f59e0b', // badges (fundo), ícones
        gelo: '#f8fafc', // fundo de páginas
        esmeralda: '#065f46', // WhatsApp, status atendimento, contraste AA+
      },
      fontFamily: {
        titulo: ['Montserrat', 'Inter', 'sans-serif'],
        corpo: ['system-ui', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

