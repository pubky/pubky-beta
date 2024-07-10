import { Icon, SideCard } from '@social/ui-shared';
import { useFilterContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { TReach } from '@/types';

export default function HotTagsReach() {
  const { hotTagsReach, setHotTagsReach } = useFilterContext();
  const [loading, setLoading] = useState(true);

  const icons = {
    following: <Icon.UsersRight />,
    followers: <Icon.UsersLeft />,
    friends: <Icon.Smiley />,
    all: <Icon.Broadcast />,
  };

  useEffect(() => {
    setHotTagsReach(hotTagsReach ? hotTagsReach : 'all');
    setLoading(false);
  }, [hotTagsReach, setHotTagsReach]);

  const handleItemClick = (value: TReach) => {
    setHotTagsReach(value);
  };

  return (
    <div className="mb-6">
      <SideCard.Header title="Reach" />
      {Object.entries(icons).map(([key, icon]) => (
        <SideCard.Item
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={key}
          selected={loading ? false : hotTagsReach === key}
          icon={icon}
          onClick={() => handleItemClick(key as TReach)}
        />
      ))}
    </div>
  );
}
