import { Icon, SideCard } from '@social/ui-shared';

export default function TagsTimeFrame() {
  return (
    <div className="mb-6">
      <SideCard.Header title="Timeframe" className="mb-2" />
      <SideCard.Item
        label="Today"
        value="today"
        disabled
        icon={<Icon.Asterisk size="24" color="gray" />}
      />
      <SideCard.Item
        label={`This\u00A0month`}
        value="this-month"
        disabled
        icon={<Icon.Calendar size="24" color="gray" />}
      />
      <SideCard.Item
        label="All time"
        value="all time"
        selected
        icon={<Icon.Clock size="24" />}
      />
    </div>
  );
}
