'use client';

import { useRouter } from 'next/navigation';
import { Icon, Typography } from '@social/ui-shared';
import { Skeleton } from '@/components';
import { useFilterContext, useModal, usePubkyClientContext } from '@/contexts';
import { UserCounts } from '@/types/User';

const tabs = [
  {
    id: 0,
    key: 'notifications',
    icon: <Icon.BellSimple size="24" color="white" />,
    label: 'Notifications'
  },
  //{
  //  id: 1,
  //  key: 'bookmarks',
  //  icon: <Icon.BookmarkSimple size="24" color="white" />,
  //  label: 'Bookmarks',
  //},
  {
    id: 1,
    key: 'posts',
    icon: <Icon.Note size="24" color="white" />,
    label: 'Posts'
  },
  {
    id: 2,
    key: 'replies',
    icon: <Icon.ChatCircleText size="24" color="white" />,
    label: 'Replies'
  },
  {
    id: 3,
    key: 'followers',
    icon: <Icon.UsersLeft size="24" color="white" />,
    label: 'Followers'
  },
  {
    id: 4,
    key: 'following',
    icon: <Icon.UsersRight size="24" color="white" />,
    label: 'Following'
  },
  {
    id: 5,
    key: 'friends',
    icon: <Icon.Smiley size="24" color="white" />,
    label: 'Friends'
  },
  {
    id: 6,
    key: 'tagged',
    icon: <Icon.Tag size="24" color="white" />,
    label: 'Tagged'
  }
];

const generateTabUrl = (key: string, creatorPubky?: string) => {
  if (creatorPubky) {
    if (key === 'notifications') return '/profile';
    return key === 'posts' ? `/profile/${creatorPubky}` : `/profile/${creatorPubky}/${key}`;
  }
  return key === 'notifications' ? '/profile' : `/profile/${key}`;
};

export default function FilterTabs({
  activeTab,
  setActiveTab,
  userCounts,
  loading,
  setLoading,
  creatorPubky,
  children
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  userCounts: UserCounts | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  creatorPubky?: string;
  children: React.ReactNode;
}) {
  const { pubky } = usePubkyClientContext();
  const { openModal } = useModal();
  const { unReadNotification } = useFilterContext();
  const router = useRouter();

  const handleTabClick = (id: number, key: string) => {
    if (id === activeTab) return;

    setLoading(true);
    setActiveTab(id);
    const url = generateTabUrl(key, creatorPubky);
    router.push(url);
  };

  const getTabNumber = (key: string) => {
    switch (key) {
      case 'notifications':
        return unReadNotification || null;
      case 'bookmarks':
        return userCounts?.bookmarks || 0;
      case 'posts':
        return (userCounts?.posts || 0) - (userCounts?.replies || 0);
      case 'replies':
        return userCounts?.replies || 0;
      case 'followers':
        return userCounts?.followers || 0;
      case 'following':
        return userCounts?.following || 0;
      case 'friends':
        return userCounts?.friends || 0;
      case 'tagged':
        return userCounts?.unique_tags || 0;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4">
      <div className="w-[280px] mt-1 self-start sticky top-[120px] hidden lg:block">
        {tabs.map((tab) => {
          if (creatorPubky && creatorPubky !== pubky && (tab.key === 'notifications' || tab.key === 'bookmarks')) {
            return null;
          }
          const isActive = activeTab === tab.id;
          return (
            <div
              id={`profile-tab-${tab.key}`}
              key={tab.id}
              onClick={() => (pubky ? handleTabClick(tab.id, tab.key) : openModal('join'))}
              className={`w-full py-2 pr-3 items-center flex justify-between cursor-pointer ${
                isActive && !loading ? 'opacity-100' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <div id="label" className="flex gap-2 items-center">
                {tab.icon}
                <Typography.Body className="tracking-normal" variant="medium-bold">
                  {tab.label}
                </Typography.Body>
              </div>
              {tab.key && (
                <Typography.Body id="counter" className="text-[13px] ml-2 tracking-normal" variant="small-bold">
                  {getTabNumber(tab.key)}
                </Typography.Body>
              )}
            </div>
          );
        })}
      </div>
      <div id="profile-tab-content" className="w-full">
        {loading ? <Skeleton.Simple /> : children}
      </div>
    </div>
  );
}

FilterTabs.tabs = tabs;
