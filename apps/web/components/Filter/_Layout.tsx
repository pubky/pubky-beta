import { Icon, SideCard } from '@social/ui-shared';
import { useFilterContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { TLayouts } from '@/types';

interface LayoutProps {
  setDrawerFilterOpen?: (open: boolean) => void;
}

export default function Layout({ setDrawerFilterOpen }: LayoutProps) {
  const { layout, setLayout } = useFilterContext();
  const [loading, setLoading] = useState(true);

  const icons = {
    columns: <Icon.ThreeColumns />,
    wide: <Icon.List />,
    visual: <Icon.SquaresFour color="gray" />,
  };

  useEffect(() => {
    setLayout(layout ? layout : 'columns');
    setLoading(false);
  }, [layout, setLayout]);

  const handleItemClick = (value: TLayouts) => {
    setLayout(value);
    setDrawerFilterOpen && setDrawerFilterOpen(false);
  };

  return (
    <div className="mb-6">
      <SideCard.Header title="Layout" />
      {Object.entries(icons).map(([key, icon]) => (
        <SideCard.Item
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={key}
          selected={loading ? false : layout === key}
          icon={icon}
          onClick={() => key !== 'visual' && handleItemClick(key as TLayouts)}
          disabled={key === 'visual'}
        />
      ))}
    </div>
  );
}
