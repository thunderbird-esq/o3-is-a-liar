/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        macbg: '#c3c7cb'
      },
      fontFamily: {
        chicago: ['ChicagoFLF', 'sans‑serif']
      }
    }
  },
  corePlugins: {
    preflight: false
  }
}
