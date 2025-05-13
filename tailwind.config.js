const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, './src/{pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}')],
  theme: {
    extend: {
      fontFamily: {
        InterTight: ['Inter Tight']
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarcolor: 'rgba(255, 255, 255, 0.16)'
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.32)',
            borderRadius: '4px',
            cursor: 'default'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            borderRadius: '4px',
            cursor: 'default'
          }
        },
        '.no-scrollbar': {
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.break-words': {
          wordBreak: 'break-word'
        },
        '.z-max': {
          zIndex: 999
        },
        '.no-html-margins': {
          '& > *': {
            margin: '0 !important'
          }
        }
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ]
};
