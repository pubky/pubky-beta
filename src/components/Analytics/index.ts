import React from 'react';

export const Analytics: React.FC = () => {
  if (!process.env.NEXT_PUBLIC_PLAUSIBLE) return null;

  return React.createElement('script', {
    defer: true,
    'data-domain': process.env.NEXT_PUBLIC_PLAUSIBLE,
    src: 'https://synonym.to/js/script.js'
  });
};

export default Analytics;
