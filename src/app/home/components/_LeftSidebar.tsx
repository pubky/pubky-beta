import { Filter } from '@/components/Filter';
import * as Components from '@/components';

interface LeftSidebarProps {
  ref?: React.RefObject<HTMLDivElement>;
}

export function LeftSidebar({ ref }: LeftSidebarProps) {
  return (
    <Components.Sidebar ref={ref} id="left-sidebar" className="w-[280px] hidden lg:block">
      <Filter.Reach />
      <Filter.Sort />
      <div className="self-start sticky top-[100px]">
        <Filter.Content />
        <Filter.Layout />
      </div>
    </Components.Sidebar>
  );
}
