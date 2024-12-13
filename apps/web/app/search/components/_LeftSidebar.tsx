import { Filter } from '@/components/Filter';
import * as Components from '@/components';

interface LeftSidebarProps {
  isFilterContentVisible: boolean;
  filterContentRef: React.RefObject<HTMLDivElement>;
}

export function LeftSidebar({
  isFilterContentVisible,
  filterContentRef,
}: LeftSidebarProps) {
  const getSidebarClass = (isFilterContentVisible: boolean) => {
    return isFilterContentVisible ? '' : 'sticky top-[120px]';
  };

  return (
    <Components.Sidebar className="w-[280px] hidden lg:block">
      <div className={`self-start ${getSidebarClass(isFilterContentVisible)}`}>
        <Filter.Reach />
        <Filter.Sort />
      </div>
      <div ref={filterContentRef}>
        <Filter.Content />
        <Filter.Layout />
      </div>
    </Components.Sidebar>
  );
}
