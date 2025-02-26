'use client';

import { Icon, SideCard } from '@social/ui-shared';
import { useFilterContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { TReach } from '@/types';

interface ReachProps {
  disabled?: boolean;
}

export default function Reach({ disabled = false }: ReachProps) {
  const { reach, setReach } = useFilterContext();
  const [loading, setLoading] = useState(true);

  const icons = {
    all: <Icon.Broadcast />,
    following: <Icon.UsersRight />,
    friends: <Icon.Smiley />
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
      <SideCard.Header title="Reach" className="mb-2" />
      {Object.entries(icons).map(([key, icon]) => (
        <SideCard.Item
          id={`reach-${key}-btn`}
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={key}
          selected={loading ? false : reach === key}
          icon={icon}
          onClick={!disabled ? () => handleItemClick(key as TReach) : undefined}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
