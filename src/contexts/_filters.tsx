'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { Utils } from '@social/utils-shared';
import {
  TContacts,
  TContactsLayout,
  TContent,
  TLayouts,
  THotTagsReach,
  TSort,
  TTimeframe,
  NotificationPreferences,
  TSource,
  ICustomFeed
} from './../types';

type FilterContextType = {
  layout: TLayouts;
  setLayout(layout: TLayouts): void;
  sort: TSort;
  setSort: (sort: TSort) => void;
  reach: TSource;
  setReach: (reach: TSource) => void;
  hotTagsReach: THotTagsReach;
  setHotTagsReach: (hotTagsReach: THotTagsReach) => void;
  contacts: TContacts;
  setContacts: (contacts: TContacts) => void;
  contactsLayout: TContactsLayout;
  setContactsLayout: (contactsLayout: TContactsLayout) => void;
  content: TContent;
  setContent: (content: TContent) => void;
  timeframe: TTimeframe;
  setTimeframe: (timeframe: TTimeframe) => void;
  unReadNotification: number;
  setUnReadNotification: React.Dispatch<React.SetStateAction<number>>;
  resetDefault: () => void;
  selectedFeed: ICustomFeed | undefined;
  setSelectedFeed: React.Dispatch<React.SetStateAction<ICustomFeed | undefined>>;
};

export const defaultPreferences: NotificationPreferences = {
  follow: true,
  new_friend: true,
  lost_friend: true,
  tag_post: true,
  tag_profile: true,
  mention: true,
  reply: true,
  repost: true,
  post_deleted: true,
  post_edited: true
};

const FilterContext = createContext<FilterContextType>({
  layout: 'columns',
  setLayout: () => {},
  sort: 'recent',
  setSort: () => {},
  reach: 'all',
  setReach: () => {},
  hotTagsReach: 'all',
  setHotTagsReach: () => {},
  contacts: 'following',
  setContacts: () => {},
  contactsLayout: 'list',
  setContactsLayout: () => {},
  content: 'all',
  setContent: () => {},
  timeframe: 'all_time',
  setTimeframe: () => {},
  unReadNotification: 0,
  setUnReadNotification: () => {},
  resetDefault: () => {},
  selectedFeed: undefined,
  setSelectedFeed: () => {}
});

export function FilterWrapper({ children }: { children: React.ReactNode }) {
  // general filters
  const [layout, setLayout] = useState<TLayouts>((Utils.storage.get('layout') as TLayouts) || 'columns');

  // home timeline filters
  const [sort, setSort] = useState<TSort>((Utils.storage.get('sort') as TSort) || 'recent');
  const [reach, setReach] = useState<TSource>((Utils.storage.get('reach') as TSource) || 'all');
  const [hotTagsReach, setHotTagsReach] = useState<THotTagsReach>(
    (Utils.storage.get('hotTagsReach') as THotTagsReach) || 'all'
  );
  const [selectedFeed, setSelectedFeed] = useState<ICustomFeed>();

  // contacts filters
  const [contacts, setContacts] = useState<TContacts>((Utils.storage.get('contacts') as TContacts) || 'following');
  const [contactsLayout, setContactsLayout] = useState<TContactsLayout>(
    (Utils.storage.get('contactsLayout') as TContactsLayout) || 'list'
  );

  // content filters
  const [content, setContent] = useState<TContent>((Utils.storage.get('content') as TContent) || 'all');
  const [timeframe, setTimeframe] = useState<TTimeframe>((Utils.storage.get('timeframe') as TTimeframe) || 'all_time');

  // notifications filters
  const [unReadNotification, setUnReadNotification] = useState<number>((Utils.storage.get('unread') as number) || 0);

  const resetDefault = () => {
    setLayout('columns');
    setSort('recent');
    setReach('all');
    setHotTagsReach('all');
    setContacts('following');
    setContactsLayout('list');
    setContent('all');
    setTimeframe('all_time');
    setUnReadNotification(0);

    Utils.storage.set('layout', 'columns');
    Utils.storage.set('sort', 'recent');
    Utils.storage.set('reach', 'all');
    Utils.storage.set('hotTagsReach', 'all');
    Utils.storage.set('contacts', 'following');
    Utils.storage.set('contactsLayout', 'list');
    Utils.storage.set('content', 'all');
    Utils.storage.set('timeframe', 'all_time');
    Utils.storage.set('unread', 0);
  };

  useEffect(() => {
    Utils.storage.set('layout', layout);
    Utils.storage.set('sort', sort);
    Utils.storage.set('reach', reach);
    Utils.storage.set('hotTagsReach', hotTagsReach);
    Utils.storage.set('contacts', contacts);
    Utils.storage.set('contactsLayout', contactsLayout);
    Utils.storage.set('content', content);
    Utils.storage.set('timeframe', timeframe);
    Utils.storage.set('unread', unReadNotification);
  }, [layout, sort, reach, hotTagsReach, contacts, contactsLayout, content, timeframe, unReadNotification]);

  useEffect(() => {
    if (selectedFeed) {
      setReach(selectedFeed.reach);
      setContent(selectedFeed.content);
      setLayout(selectedFeed.layout);
      setSort(selectedFeed.sort);
    }
  }, [selectedFeed]);

  return (
    <FilterContext.Provider
      value={{
        layout,
        setLayout,
        sort,
        setSort,
        reach,
        setReach,
        hotTagsReach,
        setHotTagsReach,
        contacts,
        setContacts,
        contactsLayout,
        setContactsLayout,
        content,
        setContent,
        timeframe,
        setTimeframe,
        unReadNotification,
        setUnReadNotification,
        resetDefault,
        selectedFeed,
        setSelectedFeed
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  return useContext(FilterContext);
}
