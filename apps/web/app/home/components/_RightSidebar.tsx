import * as Components from '@/components';

export function RightSidebar() {
  return (
    <Components.Sidebar className="col-span-2 hidden xl:block">
      <Components.WhoFollow />
      <Components.Influencers />
      <Components.HotTags />
      <Components.Feedback />
    </Components.Sidebar>
  );
}
