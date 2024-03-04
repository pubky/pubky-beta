import { DropDown, SideCard } from '@social/ui-shared';

export default function HotTags() {
  return (
    <div>
      <SideCard.Header title="Hot tags">
        <DropDown.Root
          title="Sort"
          subtitle="Sort tags by"
          items={['This week', 'Today']}
          alignment="right"
        />
      </SideCard.Header>
      <SideCard.Content>
        <div className="grid gap-3">
          <SideCard.Rank
            rank={1}
            tag="#Bitcoin"
            color="amber"
            counter="317 posts"
          />
        </div>
        <SideCard.Action text="Explore All" />
      </SideCard.Content>
    </div>
  );
}
