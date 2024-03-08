import { SideCard } from '@social/ui-shared';
import DropDownSort from './DropDownSort';

export default function HotTags() {
  return (
    <div>
      <SideCard.Header title="Hot tags">
        <DropDownSort />
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
