'use client';

import { useEffect, useState } from 'react';

const PullDownRefresh = () => {
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].pageY);
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;
      const currentY = e.touches[0].pageY;
      if (currentY - startY > 100) {
        window.location.reload();
        setIsPulling(false);
      }
    };

    const handleTouchEnd = () => setIsPulling(false);

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, isPulling]);

  return null;
};

export default PullDownRefresh;
