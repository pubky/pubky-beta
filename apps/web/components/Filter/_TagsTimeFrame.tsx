import { Icon, SideCard } from '@social/ui-shared';

interface TagsTimeFrameProps {
  disabled?: boolean;
}

export default function TagsTimeFrame({
  disabled = false,
}: TagsTimeFrameProps) {
  return (
    <div className="mb-6">
      <SideCard.Header title="Timeframe" />
      <SideCard.Item
        label="Today"
        value="today"
        disabled={disabled}
        icon={<Icon.Asterisk size="24" color="gray" />}
      />
      <SideCard.Item
        label={`This\u00A0month`}
        value="this-month"
        disabled={disabled}
        icon={<Icon.Calendar size="24" color="gray" />}
      />
      <SideCard.Item
        label="All time"
        value="all time"
        disabled={disabled}
        icon={<Icon.Clock size="24" />}
      />
    </div>
  );
}
