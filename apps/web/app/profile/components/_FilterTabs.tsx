import { useState, useEffect } from 'react';
import { Icon, Typography } from '@social/ui-shared';
import { Profile } from './';
import { Skeleton } from '@/components';
import ContactsProfile from './_ContactsProfile/ContactsProfile';

const tabs = [
  {
    id: 0,
    key: 'notifications',
    icon: (isActive: boolean, loading: boolean) => (
      <Icon.Bell size="24" color={isActive && !loading ? 'white' : 'gray'} />
    ),
    label: 'Notifications',
  },
  {
    id: 1,
    key: 'posts',
    icon: (isActive: boolean, loading: boolean) => (
      <Icon.FileText
        size="24"
        color={isActive && !loading ? 'white' : 'gray'}
      />
    ),
    label: 'Posts',
  },
  {
    id: 2,
    key: 'followers',
    icon: (isActive: boolean, loading: boolean) => (
      <Icon.UsersLeft
        size="24"
        color={isActive && !loading ? 'white' : 'gray'}
      />
    ),
    label: 'Followers',
  },
  {
    id: 3,
    key: 'following',
    icon: (isActive: boolean, loading: boolean) => (
      <Icon.UsersRight
        size="24"
        color={isActive && !loading ? 'white' : 'gray'}
      />
    ),
    label: 'Following',
  },
  {
    id: 4,
    key: 'friends',
    icon: (isActive: boolean, loading: boolean) => (
      <Icon.Smiley size="24" color={isActive && !loading ? 'white' : 'gray'} />
    ),
    label: 'Friends',
  },
];

export default function FilterTabs({
  creatorPubky,
}: {
  creatorPubky?: string;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const foundTab = tabs.find((t) => t.key === tab);

    if (foundTab) {
      setActiveTab(foundTab.id);
    } else {
      const defaultTab = creatorPubky ? tabs[1] : tabs[0];
      setActiveTab(defaultTab.id);
      params.set('tab', defaultTab.key);
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${params.toString()}`
      );
    }
    setLoading(false);
  }, [creatorPubky]);

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

  return (
    <>
      <div className="flex gap-4">
        {tabs.map((tab) => {
          if (creatorPubky && tab.key === 'notifications') {
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
                  : 'border-white border-opacity-30'
              }`}
            >
              {tab.icon(isActive, loading)}
              <Typography.Caption
                className={isActive && !loading ? '' : 'text-opacity-30'}
              >
                {tab.label}
              </Typography.Caption>
            </div>
          );
        })}
      </div>
      {loading ? (
        <Skeleton.Simple />
      ) : (
        <>
          {creatorPubky
            ? null
            : activeTab === 0 && <Profile.NotificationsProfile />}
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
