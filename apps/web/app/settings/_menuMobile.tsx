import { Icon } from '@social/ui-shared';

const menuItems: Record<
  string,
  { icon: JSX.Element; label: string; disabled?: boolean }
> = {
  account: {
    icon: <Icon.User size="24" />,
    label: 'Account',
  },
  notifications: {
    icon: <Icon.BellSimple size="24" />,
    label: 'Notifications',
  },
  privacy_safety: {
    icon: <Icon.Shield size="24" />,
    label: 'Privacy & Safety',
  },
  muted_users: {
    icon: <Icon.SpeakerSimpleSlash size="24" />,
    label: 'Muted users',
  },
  language: {
    icon: <Icon.GlobeSimple size="24" />,
    label: 'Language',
  },
  help: {
    icon: <Icon.Question size="24" />,
    label: 'Help',
  },
};

interface MenuMobileProps {
  selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;
}

export default function MenuMobile({
  selectedItem,
  setSelectedItem,
}: MenuMobileProps) {
  return (
    <div className="flex gap-6 w-full justify-between mb-4">
      {Object.keys(menuItems).map((key) => {
        const item = menuItems[key];
        const isSelected = selectedItem === key;
        const itemClass = item.disabled
          ? 'opacity-20'
          : isSelected
          ? 'cursor-pointer opacity-100'
          : 'cursor-pointer hover:bg-white hover:bg-opacity-10 hover:border-b hover:border-white hover:border-opacity-20 hover:opacity-100 opacity-60';

        return (
          <div
            key={key}
            className={`${itemClass} border-b border-white w-full pb-3 justify-center items-center inline-flex`}
            onClick={() => !item.disabled && setSelectedItem(key)}
          >
            {item.icon}
          </div>
        );
      })}
    </div>
  );
}
