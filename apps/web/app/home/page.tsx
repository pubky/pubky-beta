'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Header,
  Content,
  Input,
  Icon,
  Button,
  PostUtil,
  Modal,
  Typography,
  Card,
} from '@social/ui-shared';
import { Filter } from '../components/Filter';
import { Dropdown } from '../components/DropDown/Dropdown';
import { Post } from '../components/Post';
import { SideCard } from '../components/SideCard';
import { Menu } from '../components/Menu';

type Tag = {
  value: string;
  color: string;
};

export default function Index() {
  const [selectedA, setSelectedA] = useState(true);
  const [selectedB, setSelectedB] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showModalPost, setShowModalPost] = useState(false);
  const [showModalRePost, setShowModalRePost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const modalPostRef = useRef<HTMLDivElement>(null);
  const modalRePostRef = useRef<HTMLDivElement>(null);
  const modalTagRef = useRef<HTMLDivElement>(null);
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

    const handleClickOutsideModalPost = (event: MouseEvent) => {
      if (
        modalPostRef.current &&
        !modalPostRef.current.contains(event.target as Node)
      ) {
        setShowModalPost(false);
      }
    };

    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalTagRef.current &&
        !modalTagRef.current.contains(event.target as Node)
      ) {
        setShowModalTag(false);
      }
    };

    const handleClickOutsideModalRePost = (event: MouseEvent) => {
      if (
        modalRePostRef.current &&
        !modalRePostRef.current.contains(event.target as Node)
      ) {
        setShowModalRePost(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);
    document.addEventListener('mousedown', handleClickOutsideModalPost);
    document.addEventListener('mousedown', handleClickOutsideModalTag);
    document.addEventListener('mousedown', handleClickOutsideModalRePost);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
      document.removeEventListener('mousedown', handleClickOutsideModalPost);
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
      document.removeEventListener('mousedown', handleClickOutsideModalRePost);
    };
  }, [drawerRef, modalPostRef, modalTagRef, modalRePostRef]);

  return (
    <>
      <Content.Main>
        <Header.Root>
          <Header.Logo />
          <Header.Title title={'Streams'} />
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
                  <Menu.Section icon={<Icon.Activity />} text="Streams" />
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
                  <Menu.Section icon={<Icon.UserRectangle />} text="Profile" />
                </div>
              </div>
            </Menu.Root>
            <Menu.Bg drawerOpen={drawerOpen} />
          </>
        </Header.Root>
        <Filter.Root>
          <div className="gap-6 inline-flex">
            <Filter.Types>
              <Button.Action variant="all" active />
              <Button.Action variant="posts" />
              <Button.Action variant="image" />
              <Button.Action variant="video" />
              <Button.Action variant="link" />
            </Filter.Types>
            <Dropdown
              label="Sort by"
              title="Sort"
              subtitle="Sort posts by"
              items={['Recent', 'Weight', 'Hotness', 'Discovery']}
            />
          </div>
          <Filter.Select>
            <Input.Select
              size="small"
              text="Following"
              icon={<Icon.UserPlus />}
              active={selectedA}
              onClick={(active: boolean) => {
                setSelectedA(active);
              }}
            />
            <Input.Select
              size="small"
              text="Friends"
              icon={<Icon.Smiley />}
              active={selectedB}
              onClick={(active: boolean) => {
                setSelectedB(active);
              }}
            />
            <Dropdown
              title="Mode"
              subtitle="Switch to a different view "
              items={[
                {
                  icon: <Icon.SquareHalf />,
                  option: 'Sidebar',
                },
                {
                  icon: <Icon.List />,
                  option: 'List',
                },
                {
                  icon: <Icon.DotsNine />,
                  option: 'Grid',
                },
                {
                  icon: <Icon.SquaresFour />,
                  option: 'Columns',
                },
              ]}
              alignment="right"
            />
          </Filter.Select>
        </Filter.Root>
        <Content.Grid className="gap-6 flex justify-between">
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
                  onClick={() => setShowModalTag(true)}
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
                  onClick={() => setShowModalRePost(true)}
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
                <Dropdown
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
                <SideCard.Action
                  text="See All"
                  icon={<Icon.Users size="16" />}
                />
              </SideCard.Content>
            </div>
          </div>
          <div className="fixed bottom-10 right-10 max-w-[50%] max-h-[50%]">
            <Button.Create onClick={() => setShowModalPost(true)} />
          </div>
        </Content.Grid>
      </Content.Main>
      <Modal.Root
        modalRef={modalPostRef}
        show={showModalPost}
        closeModal={() => setShowModalPost(false)}
        className="max-w-[1200px]"
      >
        <Modal.CloseAction onClick={() => setShowModalPost(false)} />
        <Modal.Header title="New Post">
          <Button.Action
            variant="posts"
            active
            onClick={() => console.log('button clicked 1')}
          />
          <Button.Action
            variant="image"
            onClick={() => console.log('button clicked 2')}
          />
          <Button.Action
            variant="link"
            onClick={() => console.log('button clicked 3')}
          />
        </Modal.Header>
        <Modal.Content>
          <div className="mt-6 inline-flex col-span-2">
            <Input.TextArea
              className="h-[285px] p-12"
              placeholder="Write content, drop an image, or paste a link"
            />
          </div>
          <div className="flex-col justify-start items-start gap-5 mt-4 inline-flex">
            <Typography.H2>Suggested Tags</Typography.H2>
            <div className="justify-start items-start">
              <PostUtil.Tag clicked color="amber" className="mr-2 my-1">
                #Bitcoin
              </PostUtil.Tag>
              <PostUtil.Tag clicked color="amber" className="mr-2 my-1">
                #Satoshi
              </PostUtil.Tag>
              <PostUtil.Tag clicked color="red" className="mr-2 my-1">
                #P2P
              </PostUtil.Tag>
              <PostUtil.Tag clicked color="blue" className="mr-2 my-1">
                #Keys
              </PostUtil.Tag>
              <PostUtil.Tag clicked color="blue" className="mr-2 my-1">
                #Scalability
              </PostUtil.Tag>
              <PostUtil.Tag clicked color="green" className="mr-2 my-1">
                #Whitepaper
              </PostUtil.Tag>
              <PostUtil.Tag clicked color="cyan" className="mr-2 my-1">
                #PoW
              </PostUtil.Tag>
              <PostUtil.Tag clicked color="yellow" className="mr-2 my-1">
                #Cryptography
              </PostUtil.Tag>
              <PostUtil.Tag clicked color="fuchsia" className="mr-2 my-1">
                #Quote
              </PostUtil.Tag>
              <PostUtil.Tag clicked color="amber" className="mr-2 my-1">
                #Bitcointalk
              </PostUtil.Tag>
            </div>
            <div className="flex-col w-full items-start flex">
              <Input.Label value="Add tag:" />
              <Input.Text
                placeholder="#"
                action={
                  <Button.Action
                    variant="custom"
                    icon={<Icon.Plus size="20" />}
                  />
                }
              />
            </div>

            <div className="w-full">
              <Modal.SubmitAction onClick={() => setShowModalPost(false)}>
                Publish Post
              </Modal.SubmitAction>
            </div>
          </div>
        </Modal.Content>
      </Modal.Root>
      <Modal.Root
        modalRef={modalTagRef}
        show={showModalTag}
        closeModal={() => setShowModalTag(false)}
        className="w-[480px] items-stretch gap-6"
      >
        <Modal.CloseAction onClick={() => setShowModalTag(false)} />
        <Modal.Header title="Tag" />

        <Modal.Content className="block">
          <div className="flex-col gap-6 inline-flex">
            <div>
              <Typography.Label className="text-opacity-30 font-medium">
                Emotag
              </Typography.Label>
              <div className="mt-2 gap-2 inline-flex">
                <PostUtil.Tag clicked={false} color="red">
                  🔥
                </PostUtil.Tag>
                <PostUtil.Tag clicked={false} color="cyan">
                  👀
                </PostUtil.Tag>
                <PostUtil.Tag clicked={false} color="purple">
                  😂
                </PostUtil.Tag>
                <PostUtil.Tag clicked={false} color="yellow">
                  👍
                </PostUtil.Tag>
                <PostUtil.Tag clicked={false} color="blue">
                  ⭐
                </PostUtil.Tag>
                <PostUtil.Tag clicked={false} color="green">
                  🙏
                </PostUtil.Tag>
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.Plus />}
                />
              </div>
            </div>
            <div>
              <Typography.Label className="text-opacity-30 font-medium">
                SUGGESTED & RECENT
              </Typography.Label>
              <div className="mt-2 justify-start items-start">
                <PostUtil.Tag clicked color="amber" className="mr-2 my-1">
                  #Bitcoin
                </PostUtil.Tag>
                <PostUtil.Tag clicked color="amber" className="mr-2 my-1">
                  #Satoshi
                </PostUtil.Tag>
                <PostUtil.Tag clicked color="red" className="mr-2 my-1">
                  #P2P
                </PostUtil.Tag>
                <PostUtil.Tag clicked color="blue" className="mr-2 my-1">
                  #Keys
                </PostUtil.Tag>
                <PostUtil.Tag clicked color="blue" className="mr-2 my-1">
                  #Scalability
                </PostUtil.Tag>
                <PostUtil.Tag clicked color="green" className="mr-2 my-1">
                  #Whitepaper
                </PostUtil.Tag>
                <PostUtil.Tag clicked color="cyan" className="mr-2 my-1">
                  #PoW
                </PostUtil.Tag>
                <PostUtil.Tag clicked color="yellow" className="mr-2 my-1">
                  #Cryptography
                </PostUtil.Tag>
                <PostUtil.Tag clicked color="fuchsia" className="mr-2 my-1">
                  #Quote
                </PostUtil.Tag>
                <PostUtil.Tag clicked color="amber" className="mr-2 my-1">
                  #Bitcointalk
                </PostUtil.Tag>
              </div>
            </div>
            <div>
              <Input.Label value="Add tag" />
              <Input.Text
                placeholder="#"
                action={<Button.Action variant="custom" icon={<Icon.Plus />} />}
              />
            </div>
          </div>
          <div className="mt-6"></div>
          <div className="w-full mt-4">
            <Modal.SubmitAction
              icon={<Icon.Check />}
              onClick={() => setShowModalTag(false)}
            >
              Apply Tags
            </Modal.SubmitAction>
          </div>
        </Modal.Content>
      </Modal.Root>
      <Modal.Root
        modalRef={modalRePostRef}
        show={showModalRePost}
        closeModal={() => setShowModalRePost(false)}
        className="w-[480px] h-[700px] items-stretch gap-3"
      >
        <Modal.CloseAction onClick={() => setShowModalRePost(false)} />
        <Modal.Header title="Repost" />
        <Modal.Content className="block">
          <Input.Label value="Comment" />
          <Input.Text placeholder="Optional" />
          <div className="mt-6">
            <Card.Primary
              background="bg-white bg-opacity-10"
              className="w-[384px] z-auto border-0"
            >
              <div className="pb-6 justify-start items-start inline-flex">
                <div className="justify-start items-center gap-4 flex">
                  <Image
                    width={32}
                    height={32}
                    className="rounded-full"
                    alt="user"
                    src="/images/user.png"
                  />
                  <Typography.Body variant="medium-bold">
                    Satoshi Nakamoto
                  </Typography.Body>
                </div>
                <div className="grow justify-end items-center gap-1 flex mt-2">
                  <Icon.Clock size="16" color="gray" />
                  <Typography.Caption
                    variant="bold"
                    className="text-white text-opacity-30"
                  >
                    27m
                  </Typography.Caption>
                </div>
              </div>
              <div>
                <Typography.Body variant="medium" color="text-opacity-80">
                  You either want lots of people using Bitcoin (holding Bitcoin
                  keys) or you dont. Many of you seem to believe things that
                  require both positions.
                </Typography.Body>
                <div className="justify-start items-start gap-2 flex mt-6">
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
                </div>
                <div className="justify-start items-start gap-2 flex mt-6">
                  <Button.Action
                    size="small"
                    variant="custom"
                    icon={<Icon.Tag size="16" />}
                    counter={3}
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
                  />
                  <Button.Action
                    size="small"
                    variant="custom"
                    icon={<Icon.BookmarkSimple size="16" />}
                  />
                </div>
              </div>
            </Card.Primary>
          </div>
          <div className="w-full mt-4">
            <Modal.SubmitAction
              icon={<Icon.Repost />}
              onClick={() => setShowModalRePost(false)}
            >
              Repost
            </Modal.SubmitAction>
          </div>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
