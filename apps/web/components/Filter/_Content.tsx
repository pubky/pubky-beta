import { Icon, SideCard } from '@social/ui-shared';

export default function Content() {
  return (
    <div className="mb-8">
      <SideCard.Header title="Content" />
      <SideCard.Item
        label="All"
        value="all"
        selected
        icon={
          <div>
            <Icon.Stack />
          </div>
        }
        className="mt-2"
      />
      <SideCard.Item
        label="Posts"
        value="posts"
        disabled
        icon={
          <div>
            <Icon.NoteBlank color="gray" />
          </div>
        }
      />
      <SideCard.Item
        label="Images"
        value="images"
        disabled
        icon={
          <div>
            <Icon.ImageSquare color="gray" />
          </div>
        }
      />
      <SideCard.Item
        label="Videos"
        value="videos"
        disabled
        icon={
          <div>
            <Icon.Play color="gray" />
          </div>
        }
      />
      <SideCard.Item
        label="Links"
        value="links"
        disabled
        icon={
          <div>
            <Icon.LinkSimple color="gray" />
          </div>
        }
      />
    </div>
  );
}
