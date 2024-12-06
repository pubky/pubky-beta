'use client';

import { useState, useEffect } from 'react';
import { Icon, Typography } from '@social/ui-shared';
import { Profile } from './';
import { Skeleton } from '@/components';
import ContactsProfile from './_ContactsProfile/ContactsProfile';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import TaggedAs from './_TaggedAs';
import { UserCounts } from '@/types/User';

const tabs = [
  {
    id: 0,
    key: 'notifications',
    icon: <Icon.BellSimple size="24" color="white" />,
    label: 'Notifications',
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
    icon: <Icon.FileText size="24" color="white" />,
    label: 'Posts',
  },
  {
    id: 2,
    key: 'replies',
    icon: <Icon.File size="24" color="white" />,
    label: 'Replies',
  },
  {
    id: 3,
    key: 'followers',
    icon: <Icon.UsersLeft size="24" color="white" />,
    label: 'Followers',
  },
  {
    id: 4,
    key: 'following',
    icon: <Icon.UsersRight size="24" color="white" />,
    label: 'Following',
  },
  {
    id: 5,
    key: 'friends',
    icon: <Icon.Smiley size="24" color="white" />,
    label: 'Friends',
  },
  {
    id: 6,
    key: 'tagged',
    icon: <Icon.Tag size="24" color="white" />,
    label: 'Tagged',
  },
];

export default function FilterTabs({
  activeTab,
  setActiveTab,
  userCounts,
  userTags,
  loading,
  creatorPubky,
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  userCounts: UserCounts | undefined;
  userTags: number | undefined;
  loading: boolean;
  creatorPubky?: string;
}) {
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
        !creatorPubky || creatorPubky === pubky ? tabs[0] : tabs[1];
      setActiveTab(defaultTab.id);
      params.set('tab', defaultTab.key);
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${params.toString()}`,
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
        `${window.location.pathname}?${params.toString()}`,
      );
    }
  };

  const getTabNumber = (key: string) => {
    switch (key) {
      case 'notifications':
        return unReadNotification;
      case 'bookmarks':
        return userCounts?.bookmarks || 0;
      case 'posts':
        return userCounts?.posts || 0;
      case 'replies':
        return userCounts?.replies || 0;
      case 'followers':
        return userCounts?.followers || 0;
      case 'following':
        return userCounts?.following || 0;
      case 'friends':
        return userCounts?.friends || 0;
      case 'tagged':
        return userTags || 0;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2">
      <div className="w-[280px] mt-1 self-start sticky top-[120px] hidden lg:block">
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
              className={`w-full py-2 px-3 items-center flex justify-between cursor-pointer ${
                !isActive &&
                'border-b border-transparent hover:border-white/30 hover:bg-gradient-to-t from-white/10 to-transparent'
              }`}
            >
              <div
                id="label"
                className={`flex gap-2 items-center ${
                  isActive && !loading
                    ? 'opacity-100'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                {tab.icon}
                <Typography.Body
                  className="tracking-normal"
                  variant="small-bold"
                >
                  {tab.label}
                </Typography.Body>
              </div>
              {!loading && tab.key && (
                <Typography.Body
                  className="tracking-normal"
                  variant="small-bold"
                >
                  <span id="counter" className="text-[13px] ml-2 text-white/30">
                    {getTabNumber(tab.key)}
                  </span>
                </Typography.Body>
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
                {activeTab === 0 && <Profile.NotificationsProfile />}
                {/**activeTab === 1 && <Profile.Bookmarks />*/}
              </>
            )}
            {activeTab === 1 && <Profile.Posts creatorPubky={creatorPubky} />}
            {activeTab === 2 && <Profile.Replies creatorPubky={creatorPubky} />}
            {activeTab === 3 && (
              <ContactsProfile
                creatorPubky={creatorPubky}
                contacts="followers"
              />
            )}
            {activeTab === 4 && (
              <ContactsProfile
                creatorPubky={creatorPubky}
                contacts="following"
              />
            )}
            {activeTab === 5 && (
              <ContactsProfile creatorPubky={creatorPubky} contacts="friends" />
            )}
            {activeTab === 6 && (
              <TaggedAs loading={loading} creatorPubky={creatorPubky} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
