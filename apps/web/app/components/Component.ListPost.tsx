import { Icon, Button, PostUtil, Post, Typography } from '@social/ui-shared';

export default function ListPost() {
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
    <Post.Root>
      <Post.MainCard className="w-full p-12">
        <div className="gap-[126px] inline-flex">
          <div>
            <Post.Header>
              <div className="justify-start items-center gap-4 flex">
                <Post.ImageUser
                  className="w-12 h-12"
                  src="/images/user.png"
                  alt="user"
                />
                <Post.Username className="text-2xl">
                  Satoshi Nakamoto
                </Post.Username>
                <Typography.Label className="text-opacity-30">
                  @1qx8...gkw3
                </Typography.Label>
              </div>
            </Post.Header>
            <Post.Content
              className="w-[642px] text-xl"
              text="You either want lots of people using Bitcoin (holding Bitcoin keys)
          or you dont. Many of you seem to believe things that require both
          positions."
            />
            <Post.Actions>
              <Button.Action
                size="small"
                variant="custom"
                icon={<Icon.Tag size="16" />}
                counter={3}
                //onClick={() => setShowModalTag(true)}
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
          </div>
          <div className="flex-col gap-3 inline-flex">
            <Post.Time className="justify-start items-start grow-0 mb-6 mt-4">
              27 MINUTES AGO
            </Post.Time>
            <Post.Footer className="mt-0">
              <PostUtil.Tag clicked color="amber">
                #Bitcoin
              </PostUtil.Tag>
              <Button.Action
                variant="custom"
                size="small"
                icon={<Icon.Minus />}
              />
              <PostUtil.Counter counter={12} />
              <Post.UserPic images={images} />
            </Post.Footer>
            <Post.Footer className="mt-0">
              <PostUtil.Tag clicked color="red">
                #Based
              </PostUtil.Tag>
              <Button.Action
                variant="custom"
                size="small"
                icon={<Icon.Plus />}
              />
              <PostUtil.Counter counter={9} />
              <Post.UserPic images={images} />
            </Post.Footer>
          </div>
        </div>
      </Post.MainCard>
    </Post.Root>
  );
}
