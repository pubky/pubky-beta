import { useEffect, useRef, useState } from 'react';

export function useFilterVisibility() {
  const [isFilterContentVisible, setIsFilterContentVisible] = useState(true);
  const filterContentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsFilterContentVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (filterContentRef.current) {
      observer.observe(filterContentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return { isFilterContentVisible, filterContentRef };
}
