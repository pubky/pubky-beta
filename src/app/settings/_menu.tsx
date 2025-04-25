'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Icon, Typography } from '@social/ui-shared';

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

interface MenuProps {
  // selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;
}

export default function Menu({ setSelectedItem }: MenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="self-start sticky top-[120px]">
      <Typography.Body variant="large" className="font-light text-white/50">
        Settings
      </Typography.Body>
      {Object.keys(menuItems).map((key) => {
        const item = menuItems[key];
        const isSelected = pathname === item.path;
        const itemClass = item.disabled
          ? 'opacity-20'
          : isSelected
            ? 'cursor-pointer opacity-100'
            : 'cursor-pointer hover:opacity-80 opacity-50';

        return (
          <div
            id={`settings-menu-item-${key}`}
            key={key}
            className={`${itemClass} w-full h-10 py-3 justify-between items-center inline-flex`}
            onClick={() => {
              if (!item.disabled) {
                setSelectedItem(key);
                router.push(item.path);
              }
            }}
          >
            <div className="justify-start items-center gap-2 flex">
              {item.icon}
              <Typography.Body variant="medium-bold">{item.label}</Typography.Body>
            </div>
            {/**  <Icon.Next size="24" /> */}
          </div>
        );
      })}
    </div>
  );
}
