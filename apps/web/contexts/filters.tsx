'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Layout = 'sidebar' | 'list' | 'grid' | 'columns';
type Sort = 'recent' | 'tags' | 'activity';
type Reach = 'following' | 'followers' | 'friends' | 'all';
type Content = 'all' | 'posts' | 'images' | 'videos' | 'links';
type Timeframe = 'today' | 'month' | 'all';

type FilterContextType = {
  layout: Layout;
  setLayout(layout: Layout): void;
  sort: Sort;
  setSort: (sort: Sort) => void;
  reach: Reach;
  setReach: (reach: Reach) => void;
  content: Content;
  setContent: (content: Content) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
};

const FilterContext = createContext<FilterContextType>({
  layout: 'sidebar',
  setLayout: () => {},
  sort: 'recent',
  setSort: () => {},
  reach: 'all',
  setReach: () => {},
  content: 'all',
  setContent: () => {},
  timeframe: 'today',
  setTimeframe: () => {},
});

export function FilterWrapper({ children }: { children: React.ReactNode }) {
  const [layout, setLayout] = useState<Layout>(
    typeof window !== 'undefined'
      ? (localStorage.getItem('layout') as Layout)
      : 'sidebar'
  );
  const [sort, setSort] = useState<Sort>(
    typeof window !== 'undefined'
      ? (localStorage.getItem('sort') as Sort)
      : 'recent'
  );
  const [reach, setReach] = useState<Reach>(
    typeof window !== 'undefined'
      ? (localStorage.getItem('reach') as Reach)
      : 'all'
  );
  const [content, setContent] = useState<Content>(
    typeof window !== 'undefined'
      ? (localStorage.getItem('content') as Content)
      : 'all'
  );
  const [timeframe, setTimeframe] = useState<Timeframe>(
    typeof window !== 'undefined'
      ? (localStorage.getItem('timeframe') as Timeframe)
      : 'today'
  );

  // save filters to local storage
  useEffect(() => {
    localStorage.setItem('layout', layout);
    localStorage.setItem('sort', sort);
    localStorage.setItem('reach', reach);
    localStorage.setItem('content', content);
    localStorage.setItem('timeframe', timeframe);
  }, [layout, sort, reach, content, timeframe]);

  return (
    <FilterContext.Provider
      value={{
        layout,
        setLayout,
        sort,
        setSort,
        reach,
        setReach,
        content,
        setContent,
        timeframe,
        setTimeframe,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  return useContext(FilterContext);
}
