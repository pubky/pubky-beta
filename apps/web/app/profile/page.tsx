'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Header,
  Content,
  Input,
  Icon,
  PostUtil,
  Button,
  Typography,
} from '@social/ui-shared';
import { Menu } from '../components/Menu';
import Image from 'next/image';
import { Profile } from '../components/Profile';
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
          <Header.Title title={'Profile'} />
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
        <Image
          width={1920}
          height={336}
          alt="bg-profile"
          className="w-screen absolute z-0"
          src="/images/bg-profile.png"
        />
        <Content.Grid>
          <Profile.Info username="Satoshi Nakamoto" src="/images/user.png" />
        </Content.Grid>
        <Content.Grid className="mt-6 gap-6 flex justify-between">
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
          <div className="flex-col justify-start items-start gap-6 inline-flex">
            <div>
              <SideCard.Header title="profile" variantTitle="label" />
              <SideCard.Content className="flex-col gap-3 inline-flex">
                <div className="justify-start items-center gap-3 inline-flex">
                  <Image
                    width={32}
                    height={32}
                    className="rounded-full"
                    src="/images/user.png"
                    alt="user-pic"
                  />
                  <Typography.H2>Satoshi Nakamoto</Typography.H2>
                </div>
                <Typography.Label className="text-opacity-50">
                  @1qx7...gkw3
                </Typography.Label>
                <Typography.Body variant="medium" className="text-opacity-80">
                  {' '}
                  Authored the Bitcoin white paper, developed Bitcoin, mined
                  first block.
                </Typography.Body>
              </SideCard.Content>
            </div>
            <div>
              <SideCard.Header title="Tagged as" variantTitle="label" />
              <SideCard.Content>
                <div className="flex-col gap-3 inline-flex">
                  <Post.Footer className="mt-0">
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
                </div>
              </SideCard.Content>
            </div>
            <div>
              <SideCard.Header title="Contacts" variantTitle="label" />
              <SideCard.Content>
                <div className="flex-col gap-3 inline-flex">
                  <div className="inline-flex gap-2">
                    <Typography.Label>1425</Typography.Label>
                    <Typography.Label className="text-opacity-50">
                      Followers
                    </Typography.Label>
                  </div>
                  <Post.Userpics images={images} />
                </div>
              </SideCard.Content>
            </div>
            <div>
              <SideCard.Header title="Links" variantTitle="label" />
              <div className="w-96 h-24 justify-start items-start gap-4 inline-flex">
                <SideCard.Content className="justify-center items-center">
                  <Icon.Twitter />
                </SideCard.Content>
                <SideCard.Content className="justify-center items-center">
                  <Icon.Youtube />
                </SideCard.Content>
                <SideCard.Content className="justify-center items-center">
                  <Icon.Telegram />
                </SideCard.Content>
              </div>
            </div>
          </div>
        </Content.Grid>
      </Content.Main>
    </>
  );
}
