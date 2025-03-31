import * as Components from '@/components';

interface RightSidebarProps {
  ref?: React.RefObject<HTMLDivElement>;
}

export function RightSidebar({ ref }: RightSidebarProps) {
  return (
    <Components.Sidebar ref={ref} id="right-sidebar" className="w-[280px] hidden lg:block">
      <Components.WhoFollow />
      <Components.Influencers />
      <div className="self-start sticky top-[100px]">
        <Components.HotTags />
        <Components.Feedback />
      </div>
    </Components.Sidebar>
  );
}
