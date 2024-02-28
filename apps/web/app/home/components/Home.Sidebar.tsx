'use client';

import { Content, Icon, SideCard, DropDown } from '@social/ui-shared';

export default function Sidebar() {
  return (
    <div className="flex-col justify-start items-start gap-6 inline-flex">
      <div>
        <SideCard.Header title="Who to follow" />
        <SideCard.Content>
          <SideCard.User
            src="/images/user.png"
            username="Anna Pleb"
            label="@1W78...gR31"
          >
            <SideCard.FollowAction />
          </SideCard.User>
          <Content.Divider className="my-2.5" />
        </SideCard.Content>
      </div>
      <div>
        <SideCard.Header title="Hot tags">
          <DropDown.Root
            title="Sort"
            subtitle="Sort tags by"
            items={['This week', 'Today']}
            alignment="right"
          />
        </SideCard.Header>
        <SideCard.Content>
          <div className="grid gap-3">
            <SideCard.Rank
              rank={1}
              tag="#Bitcoin"
              color="amber"
              counter="317 posts"
            />
          </div>
          <SideCard.Action text="Explore All" />
        </SideCard.Content>
      </div>
      <div>
        <SideCard.Header title="Active friends" />
        <SideCard.Content>
          <SideCard.User
            src="/images/user.png"
            username="Anna Pleb"
            label="friend"
          >
            <div className="inline-flex gap-4">
              <SideCard.UserDetails label="tags" value={142} />
              <SideCard.UserDetails label="posts" value={17} />
            </div>
          </SideCard.User>
          <Content.Divider className="my-2.5" />
          <SideCard.Action text="See All" icon={<Icon.Users size="16" />} />
        </SideCard.Content>
      </div>
    </div>
  );
}
