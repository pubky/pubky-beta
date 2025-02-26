import * as Components from '@/components';

export function RightSidebar() {
  return (
    <Components.Sidebar id="right-sidebar" className="w-[280px] hidden xl:block">
      <Components.Influencers style="mt-0" />
      <Components.Feedback />
    </Components.Sidebar>
  );
}
