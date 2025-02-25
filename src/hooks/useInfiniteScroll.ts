import { useEffect, useRef } from 'react';

export function useInfiniteScroll(fetchPosts: () => void, isLoading: boolean) {
  const loader = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading) {
          fetchPosts();
        }
      },
      { threshold: 0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [fetchPosts, isLoading]);

  return loader;
}
