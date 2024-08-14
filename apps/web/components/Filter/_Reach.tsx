import { Icon, SideCard } from '@social/ui-shared';
import { useFilterContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { TReach } from '@/types';

export default function Reach() {
  const { reach, setReach } = useFilterContext();
  const [loading, setLoading] = useState(true);

  const icons = {
    all: <Icon.Broadcast />,
    following: <Icon.UsersRight />,
    friends: <Icon.Smiley />,
  };

  useEffect(() => {
    setReach(reach ? reach : 'all');
    setLoading(false);
  }, [reach, setReach]);

  const handleItemClick = (value: TReach) => {
    setReach(value);
  };

  return (
    <div className="mb-6">
      <SideCard.Header title="Reach" />
      {Object.entries(icons).map(([key, icon]) => (
        <SideCard.Item
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={key}
          selected={loading ? false : reach === key}
          icon={icon}
          onClick={() => handleItemClick(key as TReach)}
        />
      ))}
    </div>
  );
}
