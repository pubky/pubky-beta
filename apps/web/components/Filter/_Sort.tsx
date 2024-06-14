import { Icon, SideCard } from '@social/ui-shared';

export default function Sort() {
  return (
    <div className="mb-6">
      <SideCard.Header title="Sort" />
      <SideCard.Item
        label="Recent"
        value="recent"
        selected
        icon={<Icon.Asterisk />}
      />
      <SideCard.Item
        label="Popularity"
        value="popularity"
        disabled
        icon={<Icon.Fire color="gray" />}
      />
    </div>
  );
}
