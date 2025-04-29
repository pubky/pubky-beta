'use client';

import React, { useEffect } from 'react';
import { useFilterContext } from '@/contexts';
import { usePathname } from 'next/navigation';

const DynamicFavicon: React.FC = () => {
  const pathname = usePathname();
  const { unReadNotification } = useFilterContext();

  useEffect(() => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // Load the original favicon
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS
    img.src = '/images/pubky-logo.png';

    img.onload = () => {
      // Draw the original favicon
      ctx.drawImage(img, 0, 0, 32, 32);

      // Draw the green dot with black border only if there are unread notifications
      if (unReadNotification) {
        ctx.beginPath();
        ctx.arc(26, 6, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#C8FF00';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Update all favicon links
      const links = document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']");

      links.forEach((link) => {
        const dataUrl = canvas.toDataURL('image/png');
        (link as HTMLLinkElement).href = dataUrl;
      });
    };

    img.onerror = (error) => {
      console.error('Error loading image:', error);
    };
  }, [unReadNotification, pathname]); // Re-run effect when unReadNotification changes

  return null;
};

export default DynamicFavicon;
