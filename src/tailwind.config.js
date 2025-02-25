const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
  ],
  theme: {
    extend: {
      fontFamily: {
        InterTight: ['Inter Tight'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarcolor: 'rgba(255, 255, 255, 0.16)',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.32)',
            borderRadius: '4px',
            cursor: 'default',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            borderRadius: '4px',
            cursor: 'default',
          },
        },
        '.no-scrollbar': {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.break-words': {
          wordBreak: 'break-word',
        },
        '.z-max': {
          zIndex: 999,
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
