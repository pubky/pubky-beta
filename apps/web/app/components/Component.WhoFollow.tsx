import { Content, SideCard } from '@social/ui-shared';

export default function WhoFollow() {
  return (
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
  );
}
