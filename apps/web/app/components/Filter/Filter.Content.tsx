import { Icon, SideCard } from '@social/ui-shared';

export default function Content() {
  return (
    <div className="mb-6">
      <SideCard.Header title="Content" />
      <SideCard.Item
        label="All"
        value="all"
        disabled
        icon={<Icon.Stack color="gray" />}
      />
      <SideCard.Item
        label="Posts"
        value="posts"
        disabled
        icon={<Icon.NoteBlank color="gray" />}
      />
      <SideCard.Item
        label="Images"
        value="images"
        disabled
        icon={<Icon.ImageSquare color="gray" />}
      />
      <SideCard.Item
        label="Videos"
        value="videos"
        disabled
        icon={<Icon.Play color="gray" />}
      />
      <SideCard.Item
        label="Links"
        value="links"
        disabled
        icon={<Icon.LinkSimple color="gray" />}
      />
    </div>
  );
}
