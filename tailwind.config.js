module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      'sans': 'IBM Plex Sans, sans-serif'
    },
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
      '300': '300px',
      '400': '400px',
      '500': '500px',
      '600': '600px',
      '700': '700px',
      '800': '800px'
     },
     borderRadius: {
       '4xl': '2rem',
       '5xl': '2.5rem',
       '6xl': '3rem'
     }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}