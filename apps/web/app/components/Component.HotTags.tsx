import { SideCard } from '@social/ui-shared';
import { DropDown } from '../components/DropDown';
import { useRouter } from 'next/navigation';

export default function HotTags() {
  const router = useRouter();
  return (
    <div>
      <SideCard.Header title="Hot tags">
        <DropDown.TagsTimeframe type="text" />
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
        <SideCard.Action
          onClick={() => router.push('/hot-tags')}
          text="Explore All"
        />
      </SideCard.Content>
    </div>
  );
}
