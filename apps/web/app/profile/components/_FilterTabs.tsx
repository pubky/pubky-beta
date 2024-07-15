import { useState, useEffect } from 'react';
import { Icon, Typography } from '@social/ui-shared';
import { Profile } from './';
import { Skeleton } from '@/components';
import ContactsProfile from './_ContactsProfile/ContactsProfile';
import { useClientContext, useNotificationsContext } from '@/contexts';

const tabs = [
  {
    id: 0,
    key: 'notifications',
    icon: <Icon.Bell size="24" color="white" />,
    label: 'Notifications',
  },
  {
    id: 1,
    key: 'posts',
    icon: <Icon.FileText size="24" color="white" />,
    label: 'Posts',
  },
  {
    id: 2,
    key: 'followers',
    icon: <Icon.UsersLeft size="24" color="white" />,
    label: 'Followers',
  },
  {
    id: 3,
    key: 'following',
    icon: <Icon.UsersRight size="24" color="white" />,
    label: 'Following',
  },
  {
    id: 4,
    key: 'friends',
    icon: <Icon.Smiley size="24" color="white" />,
    label: 'Friends',
  },
];

export default function FilterTabs({
  creatorPubky,
  countPosts,
  countContacts,
}: {
  creatorPubky?: string;
  countPosts: number | undefined;
  countContacts: {
    followers: number;
    following: number;
    friends: number;
  };
}) {
  const { notifications, loading: loadingNotifications } =
    useNotificationsContext();
  const { pubky } = useClientContext();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

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
        `${window.location.pathname}?${params.toString()}`
      );
    }
    setLoading(false);
  }, [creatorPubky, pubky]);

  const handleTabClick = (id: number, key: string) => {
    if (!loading) {
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
        return notifications.length;
      case 'posts':
        return countPosts || 0;
      case 'followers':
        return countContacts.followers || 0;
      case 'following':
        return countContacts.following || 0;
      case 'friends':
        return countContacts.friends || 0;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        {tabs.map((tab) => {
          if (
            creatorPubky &&
            creatorPubky !== pubky &&
            tab.key === 'notifications'
          ) {
            return null;
          }
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.key)}
              className={`w-full h-12 px-3 border-b-2 justify-center items-center gap-2 inline-flex cursor-pointer ${
                isActive && !loading
                  ? 'border-white'
                  : 'border-white border-opacity-10 hover:border-opacity-50'
              }`}
            >
              {tab.icon}
              <Typography.Caption variant="bold">
                {tab.label}
                {!loading && tab.key && (
                  <span className="ml-2 text-white text-opacity-30">
                    {getTabNumber(tab.key)}
                  </span>
                )}
              </Typography.Caption>
            </div>
          );
        })}
      </div>
      {loading ? (
        <Skeleton.Simple />
      ) : (
        <>
          {(!creatorPubky || creatorPubky === pubky) && activeTab === 0 && (
            <Profile.NotificationsProfile
              notifications={notifications}
              loading={loadingNotifications}
            />
          )}
          {activeTab === 1 && <Profile.Posts creatorPubky={creatorPubky} />}
          {activeTab === 2 && (
            <ContactsProfile creatorPubky={creatorPubky} contacts="followers" />
          )}
          {activeTab === 3 && (
            <ContactsProfile creatorPubky={creatorPubky} contacts="following" />
          )}
          {activeTab === 4 && (
            <ContactsProfile creatorPubky={creatorPubky} contacts="friends" />
          )}
        </>
      )}
    </>
  );
}
