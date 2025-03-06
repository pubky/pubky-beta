import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectLayout,
  selectSort,
  selectReach,
  selectHotTagsReach,
  selectContacts,
  selectContactsLayout,
  selectContent,
  selectTimeframe,
  selectSelectedFeed,
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
} from '@/store/slices/filters';

export function useFilters() {
  const dispatch = useAppDispatch();

  const layout = useAppSelector(selectLayout);
  const sort = useAppSelector(selectSort);
  const reach = useAppSelector(selectReach);
  const hotTagsReach = useAppSelector(selectHotTagsReach);
  const contacts = useAppSelector(selectContacts);
  const contactsLayout = useAppSelector(selectContactsLayout);
  const content = useAppSelector(selectContent);
  const timeframe = useAppSelector(selectTimeframe);
  const selectedFeed = useAppSelector(selectSelectedFeed);

  return {
    layout,
    setLayout: (value) => dispatch(setLayout(value)),
    sort,
    setSort: (value) => dispatch(setSort(value)),
    reach,
    setReach: (value) => dispatch(setReach(value)),
    hotTagsReach,
    setHotTagsReach: (value) => dispatch(setHotTagsReach(value)),
    contacts,
    setContacts: (value) => dispatch(setContacts(value)),
    contactsLayout,
    setContactsLayout: (value) => dispatch(setContactsLayout(value)),
    content,
    setContent: (value) => dispatch(setContent(value)),
    timeframe,
    setTimeframe: (value) => dispatch(setTimeframe(value)),
    selectedFeed,
    setSelectedFeed: (value) => dispatch(setSelectedFeed(value)),
    resetDefault: () => dispatch(resetDefault())
  };
}
