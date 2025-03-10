import { usePubkyClientContext } from '@/contexts';
import { FilterNotificationPreferences } from '@/types';
import { Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import { useEffect } from 'react';

interface FilterTabsProps {
  selectedFilter: FilterNotificationPreferences;
  setSelectedFilter: React.Dispatch<React.SetStateAction<FilterNotificationPreferences>>;
}

const filterOptions: { key: FilterNotificationPreferences; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'follow', label: 'Follow' },
  { key: 'new_friend', label: 'Friends' },
  { key: 'tagged', label: 'Tagged' },
  { key: 'mention', label: 'Mention' },
  { key: 'reply', label: 'Replies' },
  { key: 'repost', label: 'Reposts' },
  { key: 'post_deleted', label: 'Deleted' },
  { key: 'post_edited', label: 'Edited' }
];

export default function FilterTabs({ selectedFilter, setSelectedFilter }: FilterTabsProps) {
  const { notificationPreferences } = usePubkyClientContext();

  useEffect(() => {
    const validFilters = filterOptions
      .map(({ key }) => key)
      .filter(
        (key) =>
          key === 'all' ||
          (key === 'tagged' && (notificationPreferences.tag_post || notificationPreferences.tag_profile)) ||
          notificationPreferences[key]
      );

    if (!validFilters.includes(selectedFilter)) {
      setSelectedFilter('all');
    }
  }, [selectedFilter, setSelectedFilter, notificationPreferences]);

  const baseCSS =
    'w-full cursor-pointer hover:bg-opacity-10 h-12 px-5 justify-center items-center gap-2 inline-flex bg-white bg-opacity-5 rounded-tl-lg rounded-tr-lg';
  const activeCSS = 'bg-white bg-opacity-10 rounded-tr-lg';

  return (
    <div id="filter-tabs" className="max-w-full overflow-x-auto no-scrollbar flex gap-1">
      {filterOptions.map(
        ({ key, label }) =>
          (key === 'all' ||
            (key === 'tagged' && (notificationPreferences.tag_post || notificationPreferences.tag_profile)) ||
            notificationPreferences[key]) && (
            <div
              key={key}
              onClick={() => setSelectedFilter(key)}
              className={twMerge(baseCSS, selectedFilter === key ? activeCSS : '')}
            >
              <Typography.Body className="text-[13px] leading-[13px]" variant="small-bold">
                {label}
              </Typography.Body>
            </div>
          )
      )}
    </div>
  );
}
