'use client';

import { Icon, SideCard } from '@social/ui-shared';
import { useFilterContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { THotTagsReach } from '@/types';

interface HotTagsReachProps {
  disabled?: boolean;
}

export default function HotTagsReach({ disabled }: HotTagsReachProps) {
  const { hotTagsReach, setHotTagsReach } = useFilterContext();
  const [loading, setLoading] = useState(true);

  const icons = {
    all: <Icon.Broadcast />,
    following: <Icon.UsersRight />,
    friends: <Icon.Smiley />
  };

  useEffect(() => {
    setHotTagsReach(hotTagsReach ? hotTagsReach : 'all');
    setLoading(false);
  }, [hotTagsReach, setHotTagsReach]);

  const handleItemClick = (value: THotTagsReach) => {
    setHotTagsReach(value);
  };

  return (
    <div className="mb-6">
      <SideCard.Header title="Reach" className="mb-2" />
      {Object.entries(icons).map(([key, icon]) => (
        <SideCard.Item
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={key}
          selected={loading ? false : hotTagsReach === key}
          icon={icon}
          onClick={() => handleItemClick(key as THotTagsReach)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
