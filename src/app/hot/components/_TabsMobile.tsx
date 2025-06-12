'use client';

import { Icon, Typography } from '@social/ui-shared';
import { useRouter } from 'next/navigation';

const tabs = [
  {
    id: 0,
    key: 'tags',
    icon: <Icon.Tag size="24" color="white" />,
    label: 'Tags'
  },
  {
    id: 1,
    key: 'users',
    icon: <Icon.UsersLeft size="24" color="white" />,
    label: 'Users'
  },
  {
    id: 2,
    key: 'posts',
    icon: <Icon.FileText size="24" color="white" />,
    label: 'Posts'
  }
];

const generateTabUrl = (key: string) => {
  return key === 'tags' ? '/hot' : `/hot#${key}`;
};

export default function TabsMobile({
  activeTab,
  setActiveTab,
  loading
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
}) {
  const router = useRouter();

  const handleTabClick = (id: number, key: string) => {
    if (id === activeTab) return;

    setActiveTab(id);
    const url = generateTabUrl(key);
    router.push(url);
  };

  return (
    <div className="lg:hidden">
      <div className="overflow-x-auto max-w-[380px] sm:max-w-[600px] md:max-w-[720px] flex w-full gap-4 justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              id={`mobile-profile-tab-${tab.key}`}
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.key)}
              className={`w-full pb-3 items-center gap-1 flex justify-center cursor-pointer border-b border-white ${
                isActive && !loading ? 'opacity-100' : 'opacity-50 hover:opacity-100'
              }`}
            >
              {tab.icon}
              <Typography.Body variant="small-bold">{tab.label}</Typography.Body>
            </div>
          );
        })}
      </div>
    </div>
  );
}
