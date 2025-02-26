'use client';

import { useFilterContext } from '@/contexts';
import { TTimeframe } from '@/types';
import { Icon, SideCard } from '@social/ui-shared';
import { useEffect, useState } from 'react';

interface TimeframeProps {
  disabled?: boolean;
}

export default function TagsTimeFrame({ disabled }: TimeframeProps) {
  const { timeframe, setTimeframe } = useFilterContext();
  const [loading, setLoading] = useState(true);

  const icons = {
    today: <Icon.Asterisk size="24" />,
    this_month: <Icon.Calendar size="24" />,
    all_time: <Icon.Clock size="24" />
  };

  useEffect(() => {
    setTimeframe(timeframe || 'all_time');
    setLoading(false);
  }, [timeframe, setTimeframe]);

  const handleItemClick = (value: TTimeframe) => {
    setTimeframe(value);
  };

  return (
    <div className="mb-6">
      <SideCard.Header title="Timeframe" className="mb-2" />
      {Object.entries(icons).map(([key, icon]) => {
        const label = key === 'all_time' ? 'All time' : key === 'this_month' ? 'This month' : 'Today';

        return (
          <SideCard.Item
            id={`timeframe-${key}-btn`}
            key={key}
            label={label}
            value={key}
            selected={loading ? false : timeframe === key}
            icon={icon}
            onClick={!disabled ? () => handleItemClick(key as TTimeframe) : undefined}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
}
