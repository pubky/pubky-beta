import { Icon, Typography } from '@social/ui-shared';

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
    disabled: true,
  },
  help: {
    icon: <Icon.Question size="24" />,
    label: 'Help',
    disabled: true,
  },
};

interface MenuProps {
  selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;
}

export default function Menu({ selectedItem, setSelectedItem }: MenuProps) {
  return (
    <div className="self-start sticky top-[120px]">
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
            className={`${itemClass} w-full h-10 py-6 justify-between items-center inline-flex`}
            onClick={() => !item.disabled && setSelectedItem(key)}
          >
            <div className="justify-start items-center gap-2 flex">
              {item.icon}
              <Typography.Body variant="medium-bold">
                {item.label}
              </Typography.Body>
            </div>
            <Icon.Next size="24" />
          </div>
        );
      })}
    </div>
  );
}
