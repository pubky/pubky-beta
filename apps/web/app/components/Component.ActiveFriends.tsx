import { Content, Icon, SideCard } from '@social/ui-shared';

export default function ActiveFriends() {
  return (
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
        <SideCard.Action text="See All" icon={<Icon.UsersLeft size="16" />} />
      </SideCard.Content>
    </div>
  );
}
