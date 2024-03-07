const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarcolor: 'rgb(31 29 29) white',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.32)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            borderRadius: '4px',
          },
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
