'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Header,
  Content,
  Input,
  Icon,
  Button,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import { Menu } from '../components/Menu';
import { Post } from '../components/Post';
import { SideCard } from '../components/SideCard';

type Tag = {
  value: string;
  color: string;
};

export default function Index() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const tags: Tag[] = [];
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

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, [drawerRef]);

  return (
    <>
      <Content.Main>
        <Header.Root>
          <Header.Logo />
          <Header.Title title={'Post'} />
          <Input.Search className="w-[854px]">
            {tags && (
              <Input.SearchTags>
                {tags.map((tag, index) => (
                  <Input.SearchTag
                    color={tag.color}
                    key={index}
                    actions={[<Icon.X key={index} />]}
                    value={tag.value}
                  />
                ))}
              </Input.SearchTags>
            )}
            <Input.SearchInput />
            <Input.SearchActions>
              {tags.length > 0 && <Icon.GridFour />}
              <Icon.MagnifyingGlass />
            </Input.SearchActions>
          </Input.Search>
          <>
            <div
              className="relative cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu.ImageMenu src="/images/user.png" notifications={5} />
            </div>
            <Menu.Root drawerRef={drawerRef} drawerOpen={drawerOpen}>
              <div className="w-60 flex-col gap-6 inline-flex">
                <Menu.Header
                  src="/images/user.png"
                  username="Satoshi Nakamoto"
                  handler="@1qx7...gkw3"
                />
                <div className="flex-col gap-1 inline-flex">
                  <Menu.Section
                    href="/home"
                    icon={<Icon.Activity />}
                    text="Streams"
                  />
                  <Menu.Section
                    icon={<Icon.Bell />}
                    text="Notifications"
                    counter={5}
                  />
                  <Menu.Section
                    icon={<Icon.BookmarkSimple />}
                    text="Bookmarks"
                  />
                  <Menu.Section icon={<Icon.Tag size="24" />} text="Hot Tags" />
                  <Menu.Section icon={<Icon.Users />} text="Friends" />
                  <Menu.Section icon={<Icon.GearSix />} text="Settings" />
                  <Menu.Section
                    href="/profile"
                    icon={<Icon.UserRectangle />}
                    text="Profile"
                  />
                </div>
              </div>
            </Menu.Root>
            <Menu.Bg drawerOpen={drawerOpen} />
          </>
        </Header.Root>
        <Content.Grid>
          <div className="flex-col gap-12 inline-flex">
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
                      <Post.Userpics images={images} />
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
                      <Post.Userpics images={images} />
                    </Post.Footer>
                  </div>
                </div>
              </Post.MainCard>
            </Post.Root>
            <Post.Root>
              <Post.MainCard className="w-full p-12 bg-transparent border border-opacity-30 border-dashed">
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
                        <div className="items-center gap-1 inline-flex">
                          <Typography.Label className="text-opacity-30">
                            @1qx8...gkw3
                          </Typography.Label>
                          <Icon.CheckCircle />
                        </div>
                      </div>
                    </Post.Header>
                    <Post.Content className="w-[642px]">
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
                  <div className="flex-col gap-3 inline-flex">
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
                      <PostUtil.Tag clicked color="amber">
                        #Satoshi
                      </PostUtil.Tag>
                      <PostUtil.Tag clicked color="cyan">
                        #Autonomy
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
                        <Post.Userpics images={images} />
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
                        <Post.Userpics images={images} />
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
          </div>
        </Content.Grid>
      </Content.Main>
    </>
  );
}
