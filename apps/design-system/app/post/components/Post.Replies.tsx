import {
  Content,
  Icon,
  Button,
  PostUtil,
  Post,
  Typography,
  SideCard,
} from '@social/ui-shared';

export default function Replies() {
  const images = [
    {
      src: '/images/user.png',
      alt: '1',
    },
    {
      src: '/images/user.png',
      alt: '2',
    },
    {
      src: '/images/user.png',
      alt: '3',
    },
    {
      src: '/images/user.png',
      alt: '4',
    },
    {
      src: '/images/user.png',
      alt: '5',
    },
  ];
  return (
    <div className="gap-6 flex justify-between">
      <div className="flex-col gap-6 inline-flex">
        <Typography.H2>Replies</Typography.H2>
        <div className="flex items-center">
          <div className="border-l-2 h-full border-white border-opacity-10" />
          <div className="w-6 h-px bg-white bg-opacity-20" />
          <Post.Root>
            <Post.MainCard>
              <Post.Header>
                <div className="justify-start items-center gap-4 flex">
                  <Post.ImageUser src="/images/user.png" alt="user" />
                  <Post.Username>Satoshi Nakamoto</Post.Username>
                </div>
                <Post.Time>27m</Post.Time>
              </Post.Header>
              <Post.Content
                text="You either want lots of people using Bitcoin (holding Bitcoin keys)
      or you dont. Many of you seem to believe things that require both
      positions."
              />
              <Post.Footer>
                <PostUtil.Tag clicked color="amber">
                  #Bitcoin
                </PostUtil.Tag>
                <Button.Action
                  variant="custom"
                  size="small"
                  icon={<Icon.Plus />}
                />
                <PostUtil.Counter counter={16} />
                <Post.UserPic images={images} />
              </Post.Footer>
              <Post.Actions>
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.Tag size="16" />}
                  counter={3}
                  // onClick={() => setShowModalTag(true)}
                />
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.ChatCircleText size="16" />}
                  counter={2}
                />
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.Repost size="16" />}
                  counter={7}
                  //onClick={() => setShowModalRePost(true)}
                />
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.BookmarkSimple size="16" />}
                />
              </Post.Actions>
            </Post.MainCard>
          </Post.Root>
        </div>
        <div className="flex items-center">
          <div className="border-l-2 h-full border-white border-opacity-10" />
          <div className="border-l-2 h-full ml-6 border-white border-opacity-10" />
          <div className="w-6 h-px bg-white bg-opacity-20" />
          <Post.Root>
            <Post.MainCard className="w-[768px]">
              <Post.Header>
                <div className="justify-start items-center gap-4 flex">
                  <Post.ImageUser src="/images/user.png" alt="user" />
                  <Post.Username>Satoshi Nakamoto</Post.Username>
                </div>
                <Post.Time>27m</Post.Time>
              </Post.Header>
              <Post.Content
                text="You either want lots of people using Bitcoin (holding Bitcoin keys)
      or you dont. Many of you seem to believe things that require both
      positions."
              />
              <Post.Footer>
                <PostUtil.Tag clicked color="amber">
                  #Bitcoin
                </PostUtil.Tag>
                <Button.Action
                  variant="custom"
                  size="small"
                  icon={<Icon.Plus />}
                />
                <PostUtil.Counter counter={16} />
                <Post.UserPic images={images} />
              </Post.Footer>
              <Post.Actions>
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.Tag size="16" />}
                  counter={3}
                  // onClick={() => setShowModalTag(true)}
                />
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.ChatCircleText size="16" />}
                  counter={2}
                />
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.Repost size="16" />}
                  counter={7}
                  //onClick={() => setShowModalRePost(true)}
                />
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.BookmarkSimple size="16" />}
                />
              </Post.Actions>
            </Post.MainCard>
          </Post.Root>
        </div>
      </div>
      <div className="flex-col gap-6 inline-flex">
        <div>
          <SideCard.Header title="Participants" />
          <SideCard.Content>
            <SideCard.User
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
