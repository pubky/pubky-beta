import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Utils } from '@social/utils-shared';
import {
  TLayouts,
  TSort,
  TSource,
  THotTagsReach,
  TContacts,
  TContactsLayout,
  TContent,
  TTimeframe,
  ICustomFeed
} from '@/types';
import { RootState } from '../index';

interface FiltersState {
  layout: TLayouts;
  sort: TSort;
  reach: TSource;
  hotTagsReach: THotTagsReach;
  contacts: TContacts;
  contactsLayout: TContactsLayout;
  content: TContent;
  timeframe: TTimeframe;
  selectedFeed: ICustomFeed | undefined;
}

const initialState: FiltersState = {
  layout: (Utils.storage.get('layout') as TLayouts) || 'columns',
  sort: (Utils.storage.get('sort') as TSort) || 'recent',
  reach: (Utils.storage.get('reach') as TSource) || 'all',
  hotTagsReach: (Utils.storage.get('hotTagsReach') as THotTagsReach) || 'all',
  contacts: (Utils.storage.get('contacts') as TContacts) || 'following',
  contactsLayout: (Utils.storage.get('contactsLayout') as TContactsLayout) || 'list',
  content: (Utils.storage.get('content') as TContent) || 'all',
  timeframe: (Utils.storage.get('timeframe') as TTimeframe) || 'all_time',
  selectedFeed: undefined
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setLayout: (state, action: PayloadAction<TLayouts>) => {
      state.layout = action.payload;
      Utils.storage.set('layout', action.payload);
    },
    setSort: (state, action: PayloadAction<TSort>) => {
      state.sort = action.payload;
      Utils.storage.set('sort', action.payload);
    },
    setReach: (state, action: PayloadAction<TSource>) => {
      state.reach = action.payload;
      Utils.storage.set('reach', action.payload);
    },
    setHotTagsReach: (state, action: PayloadAction<THotTagsReach>) => {
      state.hotTagsReach = action.payload;
      Utils.storage.set('hotTagsReach', action.payload);
    },
    setContacts: (state, action: PayloadAction<TContacts>) => {
      state.contacts = action.payload;
      Utils.storage.set('contacts', action.payload);
    },
    setContactsLayout: (state, action: PayloadAction<TContactsLayout>) => {
      state.contactsLayout = action.payload;
      Utils.storage.set('contactsLayout', action.payload);
    },
    setContent: (state, action: PayloadAction<TContent>) => {
      state.content = action.payload;
      Utils.storage.set('content', action.payload);
    },
    setTimeframe: (state, action: PayloadAction<TTimeframe>) => {
      state.timeframe = action.payload;
      Utils.storage.set('timeframe', action.payload);
    },
    setSelectedFeed: (state, action: PayloadAction<ICustomFeed | undefined>) => {
      state.selectedFeed = action.payload;
    },
    resetDefault: (state) => {
      state.layout = 'columns';
      state.sort = 'recent';
      state.reach = 'all';
      state.hotTagsReach = 'all';
      state.contacts = 'following';
      state.contactsLayout = 'list';
      state.content = 'all';
      state.timeframe = 'all_time';

      Utils.storage.set('layout', 'columns');
      Utils.storage.set('sort', 'recent');
      Utils.storage.set('reach', 'all');
      Utils.storage.set('hotTagsReach', 'all');
      Utils.storage.set('contacts', 'following');
      Utils.storage.set('contactsLayout', 'list');
      Utils.storage.set('content', 'all');
      Utils.storage.set('timeframe', 'all_time');
    }
  }
});

export const {
  setLayout,
  setSort,
  setReach,
  setHotTagsReach,
  setContacts,
  setContactsLayout,
  setContent,
  setTimeframe,
  setSelectedFeed,
  resetDefault
} = filtersSlice.actions;

// Selectors
export const selectLayout = (state: RootState) => state.filters.layout;
export const selectSort = (state: RootState) => state.filters.sort;
export const selectReach = (state: RootState) => state.filters.reach;
export const selectHotTagsReach = (state: RootState) => state.filters.hotTagsReach;
export const selectContacts = (state: RootState) => state.filters.contacts;
export const selectContactsLayout = (state: RootState) => state.filters.contactsLayout;
export const selectContent = (state: RootState) => state.filters.content;
export const selectTimeframe = (state: RootState) => state.filters.timeframe;
export const selectSelectedFeed = (state: RootState) => state.filters.selectedFeed;

export default filtersSlice.reducer;
