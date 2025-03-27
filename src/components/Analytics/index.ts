import React from 'react';

export const Analytics: React.FC = () => {
  if (!process.env.PLAUSIBLE) return null;

  return React.createElement('script', {
    defer: true,
    'data-domain': process.env.PLAUSIBLE,
    src: 'https://synonym.to/js/script.js'
  });
};

export default Analytics;
