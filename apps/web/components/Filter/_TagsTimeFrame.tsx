import { Icon, SideCard } from '@social/ui-shared';

interface TagsTimeFrameProps {
  disabled?: boolean;
}

export default function TagsTimeFrame({
  disabled = false,
}: TagsTimeFrameProps) {
  return (
    <div className="mb-6">
      <SideCard.Header title="Timeframe" className="mb-2" />
      <SideCard.Item
        label="Today"
        value="today"
        disabled={disabled}
        icon={
          <div>
            <Icon.Asterisk size="24" color="gray" />
          </div>
        }
      />
      <SideCard.Item
        label={`This\u00A0month`}
        value="this-month"
        disabled={disabled}
        icon={
          <div>
            <Icon.Calendar size="24" color="gray" />
          </div>
        }
      />
      <SideCard.Item
        label="All time"
        value="all time"
        disabled={disabled}
        icon={
          <div>
            <Icon.Clock size="24" />
          </div>
        }
      />
    </div>
  );
}
