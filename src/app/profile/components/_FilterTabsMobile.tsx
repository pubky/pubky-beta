'use client';

import { Icon, Typography } from '@social/ui-shared';
import { useFilterContext, useModal, usePubkyClientContext } from '@/contexts';
import { UserCounts } from '@/types/User';
import { useRouter } from 'next/navigation';

const tabs = [
  {
    id: 6,
    key: 'tagged',
    icon: <Icon.UserRectangle size="24" color="white" />,
    label: 'Tagged'
  },
  {
    id: 0,
    key: 'notifications',
    icon: <Icon.Bell size="24" color="white" />,
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
  }
];

const generateTabUrl = (key: string, creatorPubky?: string) => {
  if (creatorPubky) {
    if (key === 'notifications') return '/profile';
    return key === 'posts' ? `/profile/${creatorPubky}` : `/profile/${creatorPubky}/${key}`;
  }
  return key === 'notifications' ? '/profile' : `/profile/${key}`;
};

export default function FilterTabsMobile({
  activeTab,
  setActiveTab,
  userCounts,
  loading,
  setLoading,
  creatorPubky
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  userCounts: UserCounts | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  creatorPubky?: string;
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
        return null; // userCounts?.unique_tags || 0;
      default:
        return null;
    }
  };

  return (
    <div className="w-full lg:hidden">
      <div className="overflow-x-auto max-w-[380px] sm:max-w-[600px] md:max-w-[720px] flex w-full gap-3 justify-between">
        {tabs.map((tab) => {
          if (creatorPubky && creatorPubky !== pubky && (tab.key === 'notifications' || tab.key === 'bookmarks')) {
            return null;
          }
          const isActive = activeTab === tab.id;
          return (
            <div
              id={`mobile-profile-tab-${tab.key}`}
              key={tab.id}
              onClick={() => (pubky ? handleTabClick(tab.id, tab.key) : openModal('join'))}
              className={`w-full pb-3 justify-center items-center gap-1 flex cursor-pointer border-b border-white ${
                isActive && !loading ? 'opacity-100' : 'opacity-50 hover:opacity-100'
              }`}
            >
              {tab.icon}
              {getTabNumber(tab.key) !== null && (
                <Typography.Caption className="tracking-normal" variant="bold">
                  <span id="counter">{getTabNumber(tab.key)}</span>
                </Typography.Caption>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
