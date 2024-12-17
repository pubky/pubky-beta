import * as Components from '@/components';

export function RightSidebar() {
  return (
    <Components.Sidebar id="right-sidebar" className="w-[280px] hidden xl:block">
      <Components.WhoFollow />
      <Components.Influencers />
      <Components.HotTags />
      <Components.Feedback />
    </Components.Sidebar>
  );
}
