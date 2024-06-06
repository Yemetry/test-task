module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: '900px'
    },

    extend: {
      colors: {
        primary: '#4A40C6',
        secondary: '#23262F',
        accent: '#3C3C3C',
        'light-gray': '#F0F0F0',
        'dark-gray': '#5F5F5F',
        'shadow-gray': '#0F0F0F0D',
        'bg-card': '#f9f9f9',
        'bg-light': '#FBFBFB',
        'scrollbar-track': '#f1f3f9',
        'scrollbar-thumb': '#bfbcdd',
        'border-gray': '#958EE8',
        'middle-gray': '#9A9A9A'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
