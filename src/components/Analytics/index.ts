import React from 'react';

export const Analytics: React.FC = () => {
  if (!process.env.PLAUSIBLE || process.env.PLAUSIBLE === 'false') return null;

  return React.createElement('script', {
    defer: true,
    'data-domain': 'beta.pubky.app',
    src: 'https://synonym.to/js/script.js'
  });
};

export default Analytics;
