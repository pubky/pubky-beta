import { Filter } from '@/components/Filter';
import * as Components from '@/components';

export function LeftSidebar() {
  return (
    <Components.Sidebar id="left-sidebar" className="w-[280px] self-start sticky top-[120px] hidden lg:block">
      <Filter.SortWhoToFollow />
    </Components.Sidebar>
  );
}
