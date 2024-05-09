import { Icon, SideCard } from '@social/ui-shared';

export default function Sort() {
  return (
    <div className="mb-6">
      <SideCard.Header title="Sort" />
      <SideCard.Item
        label="Recent"
        value="recent"
        disabled
        icon={<Icon.Asterisk color="gray" />}
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
