'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@social/ui-shared';

const menuItems: Record<string, { icon: JSX.Element; label: string; path: string; disabled?: boolean }> = {
  account: {
    icon: <Icon.User size="24" />,
    label: 'Account',
    path: '/settings/account'
  },
  notifications: {
    icon: <Icon.BellSimple size="24" />,
    label: 'Notifications',
    path: '/settings/notifications'
  },
  privacy_safety: {
    icon: <Icon.Shield size="24" />,
    label: 'Privacy & Safety',
    path: '/settings/privacy-safety'
  },
  muted_users: {
    icon: <Icon.SpeakerSimpleSlash size="24" />,
    label: 'Muted Users',
    path: '/settings/muted-users'
  },
  language: {
    icon: <Icon.GlobeSimple size="24" />,
    label: 'Language',
    path: '/settings/language'
  },
  help: {
    icon: <Icon.Question size="24" />,
    label: 'Help',
    path: '/settings/help'
  }
};

interface MenuMobileProps {
  // selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;
}

export default function MenuMobile({
  // selectedItem,
  setSelectedItem
}: MenuMobileProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-3 w-full justify-between">
      {Object.keys(menuItems).map((key) => {
        const item = menuItems[key];
        const isSelected = pathname === item.path;
        const itemClass = item.disabled
          ? 'opacity-20'
          : isSelected
            ? 'cursor-pointer opacity-100'
            : 'cursor-pointer hover:bg-white hover:bg-opacity-10 hover:border-b hover:border-white hover:border-opacity-20 hover:opacity-100 opacity-60';

        return (
          <div
            key={key}
            className={`${itemClass} border-b border-white w-full pb-3 justify-center items-center inline-flex`}
            onClick={() => {
              if (!item.disabled) {
                setSelectedItem(key);
                router.push(item.path);
              }
            }}
          >
            {item.icon}
          </div>
        );
      })}
    </div>
  );
}
