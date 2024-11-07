'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { Utils } from '@social/utils-shared';
import {
  TContacts,
  TContactsLayout,
  TContent,
  TLayouts,
  TReach,
  THotTagsReach,
  TSort,
  TTimeframe,
  NotificationPreferences,
} from './../types';

export type FilterContextType = {
  layout: TLayouts;
  setLayout(layout: TLayouts): void;
  sort: TSort;
  setSort: (sort: TSort) => void;
  reach: TReach;
  setReach: (reach: TReach) => void;
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
  notificationPreferences: NotificationPreferences;
  setNotificationPreferences: (prefs: NotificationPreferences) => void;
  unReadNotification: number;
  setUnReadNotification: React.Dispatch<React.SetStateAction<number>>;
};

const defaultPreferences: NotificationPreferences = {
  follow: true,
  new_friend: true,
  lost_friend: true,
  tag_post: true,
  tag_profile: true,
  mention: true,
  reply: true,
  repost: true,
  post_deleted: true,
  post_edited: true,
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
  timeframe: 'today',
  setTimeframe: () => {},
  notificationPreferences: defaultPreferences,
  setNotificationPreferences: () => {},
  unReadNotification: 0,
  setUnReadNotification: () => {},
});

export function FilterWrapper({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [layout, setLayout] = useState<TLayouts>(
    (Utils.storage.get('layout') as TLayouts) || 'columns'
  );
  const [sort, setSort] = useState<TSort>(
    (Utils.storage.get('sort') as TSort) || 'recent'
  );
  const [reach, setReach] = useState<TReach>(
    (Utils.storage.get('reach') as TReach) || 'all'
  );
  const [hotTagsReach, setHotTagsReach] = useState<THotTagsReach>(
    (Utils.storage.get('hotTagsReach') as THotTagsReach) || 'all'
  );
  const [contacts, setContacts] = useState<TContacts>(
    (Utils.storage.get('contacts') as TContacts) || 'following'
  );
  const [contactsLayout, setContactsLayout] = useState<TContactsLayout>(
    (Utils.storage.get('contactsLayout') as TContactsLayout) || 'list'
  );
  const [content, setContent] = useState<TContent>(
    (Utils.storage.get('content') as TContent) || 'all'
  );
  const [timeframe, setTimeframe] = useState<TTimeframe>(
    (Utils.storage.get('timeframe') as TTimeframe) || 'today'
  );
  const [unReadNotification, setUnReadNotification] = useState<number>(
    (Utils.storage.get('unread') as number) || 0
  );
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences>(
      (Utils.storage.get(
        'notificationPreferences'
      ) as NotificationPreferences) || defaultPreferences
    );

  // save filters to local storage
  useEffect(() => {
    Utils.storage.set('layout', layout);
    Utils.storage.set('sort', sort);
    Utils.storage.set('reach', reach);
    Utils.storage.set('hotTagsReach', hotTagsReach);
    Utils.storage.set('contacts', contacts);
    Utils.storage.set('contactsLayout', contactsLayout);
    Utils.storage.set('content', content);
    Utils.storage.set('timeframe', timeframe);
    Utils.storage.set('notificationPreferences', notificationPreferences);
    Utils.storage.set('unread', unReadNotification);
    setIsInitialized(true);
  }, [
    layout,
    sort,
    reach,
    hotTagsReach,
    contacts,
    contactsLayout,
    content,
    timeframe,
    notificationPreferences,
  ]);

  if (!isInitialized) return null;

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
        notificationPreferences,
        setNotificationPreferences,
        unReadNotification,
        setUnReadNotification,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  return useContext(FilterContext);
}
