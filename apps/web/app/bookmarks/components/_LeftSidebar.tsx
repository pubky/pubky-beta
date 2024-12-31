import { Filter } from '@/components/Filter';
import * as Components from '@/components';

interface LeftSidebarProps {
  ref?: React.RefObject<HTMLDivElement>;
}

export function LeftSidebar({ ref }: LeftSidebarProps) {
  return (
    <Components.Sidebar
      ref={ref}
      id="left-sidebar"
      className="sticky top-24 h-screen w-[180px] overflow-y-auto no-scrollbar flex-shrink-0 hidden lg:block"
    >
      <div className="pb-20 mb-20">
        <Filter.Sort />
        <Filter.Content />
        <Filter.Layout />
      </div>
    </Components.Sidebar>
  );
}
