import * as Components from '@/components';

interface RightSidebarProps {
  ref?: React.RefObject<HTMLDivElement>;
}

export function RightSidebar({ ref }: RightSidebarProps) {
  return (
    <Components.Sidebar
      ref={ref}
      id="right-sidebar"
      className="sticky top-24 h-screen w-[180px] overflow-y-auto no-scrollbar flex-shrink-0 hidden xl:block"
    >
      <div className="pb-20 mb-20">
        <Components.WhoFollow />
        <Components.Influencers />
        <Components.HotTags />
        <Components.Feedback />
      </div>
    </Components.Sidebar>
  );
}
