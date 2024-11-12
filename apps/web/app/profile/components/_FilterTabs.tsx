import { useState, useEffect } from 'react';
import { Icon, Typography } from '@social/ui-shared';
import { Profile } from './';
import { Skeleton } from '@/components';
import ContactsProfile from './_ContactsProfile/ContactsProfile';
import {
  useFilterContext,
  useNotificationsContext,
  usePubkyClientContext,
} from '@/contexts';
import TaggedAs from './_TaggedAs';
import { UserView } from '@/types/User';

const tabs = [
  {
    id: 0,
    key: 'notifications',
    icon: <Icon.Bell size="24" color="white" />,
    label: 'Notifications',
  },
  {
    id: 1,
    key: 'bookmarks',
    icon: <Icon.BookmarkSimple size="24" color="white" />,
    label: 'Bookmarks',
  },
  {
    id: 2,
    key: 'posts',
    icon: <Icon.FileText size="24" color="white" />,
    label: 'Posts',
  },
  {
    id: 3,
    key: 'replies',
    icon: <Icon.FileText size="24" color="white" />,
    label: 'Replies',
  },
  {
    id: 4,
    key: 'followers',
    icon: <Icon.UsersLeft size="24" color="white" />,
    label: 'Followers',
  },
  {
    id: 5,
    key: 'following',
    icon: <Icon.UsersRight size="24" color="white" />,
    label: 'Following',
  },
  {
    id: 6,
    key: 'friends',
    icon: <Icon.Smiley size="24" color="white" />,
    label: 'Friends',
  },
  {
    id: 7,
    key: 'tagged',
    icon: <Icon.Tag size="24" color="white" />,
    label: 'Tagged',
  },
];

export default function FilterTabs({
  activeTab,
  setActiveTab,
  creatorPubky,
  countPosts,
  countReplies,
  countContacts,
  loading,
  profile,
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  creatorPubky?: string;
  countPosts: number | undefined;
  countReplies: number | undefined;
  countContacts: {
    followers: number;
    following: number;
    friends: number;
  };
  loading: boolean;
  profile: UserView | null;
}) {
  const { notifications, loading: loadingNotifications } =
    useNotificationsContext();
  const { pubky } = usePubkyClientContext();
  const { unReadNotification } = useFilterContext();
  const [loadingTab, setLoadingTab] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const foundTab = tabs.find((t) => t.key === tab);

    if (foundTab) {
      setActiveTab(foundTab.id);
    } else {
      const defaultTab =
        !creatorPubky || creatorPubky === pubky ? tabs[0] : tabs[2];
      setActiveTab(defaultTab.id);
      params.set('tab', defaultTab.key);
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${params.toString()}`
      );
    }
    setLoadingTab(false);
  }, [creatorPubky, pubky]);

  const handleTabClick = (id: number, key: string) => {
    if (!loadingTab) {
      setActiveTab(id);
      const params = new URLSearchParams(window.location.search);
      params.set('tab', key);
      window.history.pushState(
        {},
        '',
        `${window.location.pathname}?${params.toString()}`
      );
    }
  };

  const getTabNumber = (key: string) => {
    switch (key) {
      case 'notifications':
        return unReadNotification;
      case 'bookmarks':
        return profile?.counts?.bookmarks;
      case 'posts':
        return countPosts || 0;
      case 'replies':
        return countReplies || 0;
      case 'followers':
        return countContacts.followers || 0;
      case 'following':
        return countContacts.following || 0;
      case 'friends':
        return countContacts.friends || 0;
      case 'tagged':
        return profile?.tags.length || 0;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4">
      <div className="w-[300px] self-start sticky top-[120px] hidden lg:block">
        {tabs.map((tab) => {
          if (
            creatorPubky &&
            creatorPubky !== pubky &&
            (tab.key === 'notifications' || tab.key === 'bookmarks')
          ) {
            return null;
          }
          const isActive = activeTab === tab.id;
          return (
            <div
              id={`profile-tab-${tab.key}`}
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.key)}
              className={`w-full h-12 px-3 items-center gap-2 flex justify-between cursor-pointer ${
                isActive && !loading
                  ? 'opacity-100'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <div className="flex gap-2 items-center">
                {tab.icon}
                <Typography.Caption className="tracking-normal" variant="bold">
                  {tab.label}
                </Typography.Caption>
              </div>
              {!loading && tab.key && (
                <Typography.Caption className="tracking-normal" variant="bold">
                  <span
                    id="counter"
                    className="ml-2 text-white text-opacity-30"
                  >
                    {getTabNumber(tab.key)}
                  </span>
                </Typography.Caption>
              )}
            </div>
          );
        })}
      </div>
      <div id="profile-tab-content" className="w-full">
        {loading ? (
          <Skeleton.Simple />
        ) : (
          <>
            {(!creatorPubky || creatorPubky === pubky) && (
              <>
                {activeTab === 0 ? (
                  <Profile.NotificationsProfile
                    notifications={notifications}
                    loading={loadingNotifications}
                  />
                ) : (
                  activeTab === 1 && <Profile.Bookmarks />
                )}
              </>
            )}
            {activeTab === 2 && <Profile.Posts creatorPubky={creatorPubky} />}
            {activeTab === 3 && <Profile.Replies creatorPubky={creatorPubky} />}
            {activeTab === 4 && (
              <ContactsProfile
                creatorPubky={creatorPubky}
                contacts="followers"
              />
            )}
            {activeTab === 5 && (
              <ContactsProfile
                creatorPubky={creatorPubky}
                contacts="following"
              />
            )}
            {activeTab === 6 && (
              <ContactsProfile creatorPubky={creatorPubky} contacts="friends" />
            )}
            {activeTab === 7 && (
              <TaggedAs loading={loading} creatorPubky={creatorPubky} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
