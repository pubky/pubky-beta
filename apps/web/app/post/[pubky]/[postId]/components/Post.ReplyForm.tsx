import {
  Icon,
  Button,
  PostUtil,
  Post,
  Typography,
  Input,
} from '@social/ui-shared';

export default function ReplyForm() {
  return (
    <Post.Root>
      <Post.MainCard className="w-full p-12 bg-transparent border border-opacity-30 border-dashed">
        <div className="justify-between block lg:inline-flex">
          <div>
            <Post.Header>
              <div className="justify-start items-center gap-4 flex">
                <Post.ImageUser
                  className="lg:w-12 lg:h-12"
                  src="/images/user.png"
                  alt="user"
                />
                <Post.Username className="lg:text-2xl">
                  Satoshi Nakamoto
                </Post.Username>
                <div className="hidden items-center gap-1 sm:inline-flex">
                  <Typography.Label className="text-opacity-30">
                    @1qx8...gkw3
                  </Typography.Label>
                  <Icon.CheckCircle />
                </div>
              </div>
            </Post.Header>
            <Post.Content>
              <Input.CursorArea
                className="text-2xl h-8"
                placeholder="Post your reply"
              />
            </Post.Content>
            <Button.Medium
              className="w-[111px] mt-6"
              icon={<Icon.ChatCircleText />}
            >
              Reply
            </Button.Medium>
          </div>
          <div className="flex-col gap-3 inline-flex mt-6 lg:mt-0">
            <div className="gap-1 items-center inline-flex">
              <Icon.Tag color="gray" />
              <Typography.Label className="text-opacity-30">
                TAGS
              </Typography.Label>
            </div>
            <Post.Footer className="mt-4">
              <PostUtil.Tag clicked color="amber">
                #Bitcoin
              </PostUtil.Tag>
              <Button.Action
                variant="custom"
                size="small"
                icon={<Icon.Tag />}
              />
            </Post.Footer>
          </div>
        </div>
      </Post.MainCard>
    </Post.Root>
  );
}
