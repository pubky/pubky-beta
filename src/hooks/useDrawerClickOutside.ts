import { useEffect, RefObject } from 'react';

export function useDrawerClickOutside(ref: RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, [ref, callback]);
}
