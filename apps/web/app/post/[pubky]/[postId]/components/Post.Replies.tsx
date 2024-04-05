import { Content, Icon, Button, Typography, SideCard } from '@social/ui-shared';
// import { Post } from '../../components';

export default function Replies() {
  return (
    <div className="gap-6 flex justify-between">
      <div className="flex-col gap-6 inline-flex">
        <Typography.H2>Replies</Typography.H2>
        {/* <div className="flex items-center">
          <div className="border-l-2 h-full border-white border-opacity-10" />
          <div className="w-6 h-px bg-white bg-opacity-20" />
          <Post />
        </div> */}
        {/* <div className="flex items-center">
          <div className="border-l-2 h-full border-white border-opacity-10" />
          <div className="border-l-2 h-full ml-6 border-white border-opacity-10" />
          <div className="w-6 h-px bg-white bg-opacity-20" />
          <Post />
        </div> */}
      </div>
      <div className="hidden flex-col gap-6 xl:inline-flex">
        <div>
          <SideCard.Header title="Participants" />
          <SideCard.Content>
            <SideCard.User
              uri=""
              src="/images/user.png"
              username="John Carvalho"
              label="@1W78...gR31"
            >
              <Button.Medium
                className="w-[114px] bg-transparent"
                icon={<Icon.Check />}
              >
                Me
              </Button.Medium>
            </SideCard.User>
            <Content.Divider className="my-2.5" />
            <SideCard.User
              uri=""
              src="/images/user.png"
              username="Anna Pleb"
              label="@1W78...gR31"
            >
              <SideCard.FollowAction />
            </SideCard.User>
          </SideCard.Content>
        </div>
      </div>
    </div>
  );
}
