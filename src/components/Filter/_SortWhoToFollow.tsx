import { Icon, SideCard } from '@social/ui-shared';

export default function SortWhoToFollow() {
  return (
    <div className="mb-6">
      <SideCard.Header title="Sort" className="mb-2" />
      <SideCard.Item label="Suggested" value="suggested" disabled icon={<Icon.Lightbulb size="24" color="gray" />} />
      <SideCard.Item label={`Mutual`} value="mutual" disabled icon={<Icon.ArrowsLeftRight size="24" color="gray" />} />
      <SideCard.Item label="Followers" value="followers" disabled icon={<Icon.UsersLeft size="24" />} />
      <SideCard.Item label="Username" value="username" disabled icon={<Icon.ListBullets size="24" />} />
    </div>
  );
}
