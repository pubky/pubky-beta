'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import localStorageUtils from '../libs/localStorageUtils';
import {
  TContacts,
  TContactsLayout,
  TContent,
  TLayouts,
  TReach,
  TSort,
  TTimeframe,
} from './../types';

type FilterContextType = {
  layout: TLayouts;
  setLayout(layout: TLayouts): void;
  sort: TSort;
  setSort: (sort: TSort) => void;
  reach: TReach;
  setReach: (reach: TReach) => void;
  contacts: TContacts;
  setContacts: (contacts: TContacts) => void;
  contactsLayout: TContactsLayout;
  setContactsLayout: (contactsLayout: TContactsLayout) => void;
  content: TContent;
  setContent: (content: TContent) => void;
  timeframe: TTimeframe;
  setTimeframe: (timeframe: TTimeframe) => void;
};

const FilterContext = createContext<FilterContextType>({
  layout: 'sidebar',
  setLayout: () => {},
  sort: 'recent',
  setSort: () => {},
  reach: 'all',
  setReach: () => {},
  contacts: 'following',
  setContacts: () => {},
  contactsLayout: 'ranking',
  setContactsLayout: () => {},
  content: 'all',
  setContent: () => {},
  timeframe: 'today',
  setTimeframe: () => {},
});

export function FilterWrapper({ children }: { children: React.ReactNode }) {
  const [layout, setLayout] = useState<TLayouts>(
    (localStorageUtils.get('layout') as TLayouts) || 'sidebar'
  );
  const [sort, setSort] = useState<TSort>(
    (localStorageUtils.get('sort') as TSort) || 'recent'
  );
  const [reach, setReach] = useState<TReach>(
    (localStorageUtils.get('reach') as TReach) || 'all'
  );
  const [contacts, setContacts] = useState<TContacts>(
    (localStorageUtils.get('contacts') as TContacts) || 'following'
  );
  const [contactsLayout, setContactsLayout] = useState<TContactsLayout>(
    (localStorageUtils.get('contactsLayout') as TContactsLayout) || 'ranking'
  );
  const [content, setContent] = useState<TContent>(
    (localStorageUtils.get('content') as TContent) || 'all'
  );
  const [timeframe, setTimeframe] = useState<TTimeframe>(
    (localStorageUtils.get('timeframe') as TTimeframe) || 'today'
  );

  // save filters to local storage
  useEffect(() => {
    localStorageUtils.set('layout', layout);
    localStorageUtils.set('sort', sort);
    localStorageUtils.set('reach', reach);
    localStorageUtils.set('contacts', contacts);
    localStorageUtils.set('contactsLayout', contactsLayout);
    localStorageUtils.set('content', content);
    localStorageUtils.set('timeframe', timeframe);
  }, [layout, sort, reach, contacts, contactsLayout, content, timeframe]);

  return (
    <FilterContext.Provider
      value={{
        layout,
        setLayout,
        sort,
        setSort,
        reach,
        setReach,
        contacts,
        setContacts,
        contactsLayout,
        setContactsLayout,
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
