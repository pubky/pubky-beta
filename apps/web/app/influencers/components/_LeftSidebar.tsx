import { Filter } from '@/components/Filter';
import * as Components from '@/components';

export function LeftSidebar() {
  return (
    <Components.Sidebar className="col-span-1 self-start sticky top-[120px] hidden lg:block">
      <Filter.HotTagsReach disabled />
      <Filter.TagsTimeFrame disabled />
    </Components.Sidebar>
  );
}
