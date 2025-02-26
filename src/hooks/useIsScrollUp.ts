import { useEffect, useState } from 'react';

/**
 * Custom hook to determine if the user is scrolling up.
 * @returns {boolean} - `true` if the user is scrolling up, otherwise `false`.
 */
const useIsScrollup = (): boolean => {
  const [isScrollUp, setIsScrollUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsScrollUp(false);
      } else {
        // Scrolling up
        setIsScrollUp(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return isScrollUp;
};

export default useIsScrollup;
