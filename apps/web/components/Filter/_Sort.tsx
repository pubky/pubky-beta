import { Icon, SideCard } from '@social/ui-shared';
import { useFilterContext } from '@/contexts/filters';
import { useEffect, useState } from 'react';
import { TSort } from '@/types';

export default function Sort() {
  const { sort, setSort } = useFilterContext();
  const [loading, setLoading] = useState(true);

  const icons = {
    recent: <Icon.Asterisk />,
    popularity: <Icon.Fire />,
  };

  useEffect(() => {
    setSort(sort ? sort : 'recent');
    setLoading(false);
  }, [sort, setSort]);

  const handleItemClick = (value: TSort) => {
    setSort(value);
  };

  return (
    <div className="mb-6">
      <SideCard.Header title="Sort" />
      {Object.entries(icons).map(([key, icon]) => (
        <SideCard.Item
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={key}
          selected={loading ? false : sort === key}
          icon={icon}
          onClick={() => handleItemClick(key as TSort)}
        />
      ))}
    </div>
  );
}
