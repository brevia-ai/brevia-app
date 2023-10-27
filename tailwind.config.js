const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: colors.sky[700],
        danger: colors.pink[700],
        lobster: '#F04E53',
      },
      screens: {
        '3xl': '1728px',
        '4xl': '1920px',
      },
      height: {
        'viewport': '100svh',
      },
      lineHeight: {
        '12': '3rem',
      },
      listStyleType: {
        square: 'square',
      },
    }
  }
}
