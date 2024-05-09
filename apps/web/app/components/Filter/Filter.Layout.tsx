import { Icon, SideCard } from '@social/ui-shared';

export default function Layout() {
  return (
    <div className="mb-6">
      <SideCard.Header title="Layout" />
      <SideCard.Item
        label="Columns"
        value="columns"
        disabled
        icon={<Icon.ThreeColumns color="gray" />}
      />
      <SideCard.Item
        label="Wide"
        value="wide"
        disabled
        icon={<Icon.SquaresFour color="gray" />}
      />
      <SideCard.Item
        label="Visual"
        value="visual"
        disabled
        icon={<Icon.Smiley color="gray" />}
      />
    </div>
  );
}
