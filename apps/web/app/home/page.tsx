'use client';

import { Button, Content, Icon, Input, Typography } from '@social/ui-shared';
import {
  // ActiveFriends,
  CreatePost,
  Header,
  HotTags,
  Post,
  PostsLayout,
  Sidebar,
  WhoFollow,
} from '../components';
// import { DropDown } from '../components/DropDown';
import { useEffect, useRef, useState } from 'react';
import { useClientContext } from '../../contexts/client';
import { useFilterContext } from '../../contexts/filters';
import { IPost, INewPost } from '../../types';
import { Filter } from '../components/Filter';
import { minifyPubky } from '../../libs/pubkyHelper';
import Image from 'next/image';

{
  /**const layouts = {
  sidebar: {
    layout: 'grid-cols-3',
    posts: 'col-span-3 xl:col-span-2 flex-col inline-flex gap-6',
  },
  grid: {
    layout: 'lg:grid-cols-2 xl:grid-cols-3',
    posts: '',
  },
  columns: {
    layout: 'md:grid-cols-2',
    posts: '',
  },
  list: {
    layout: 'grid-cols-1',
    posts: '',
  },
}; */
}

const Loading = (posts: number) => (
  <div className="flex w-full justify-center flex-col">
    <div
      className={`flex w-full justify-center ${posts === 0 ? 'mt-10' : 'mt-2'}`}
    >
      <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
    </div>
    <Typography.Body
      variant="medium-bold"
      className="col-span-3 flex mt-2 justify-center items-center gap-6 text-opacity-20"
    >
      Loading Posts
    </Typography.Body>
  </div>
);

export default function Index() {
  const { reach } = useFilterContext();
  const {
    pubky,
    getUserIndexed,
    createPost,
    listGlobalPosts,
    posts,
    setPosts,
  } = useClientContext();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('Loading...');
  const [handler, setHandler] = useState('');
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const [content, setContent] = useState('');
  const [sendingPost, setSendingPost] = useState(false);
  const loader = useRef(null);

  const fetchData = async (pointer: string) => {
    setLoading(true);

    const results = await listGlobalPosts(pointer, reach);

    if (results && results.feed) {
      const newPostsTemp = results.feed.reduce((acc: INewPost, post: IPost) => {
        acc[post.id] = post;
        return acc;
      }, {});

      setPosts((prev: INewPost) => ({ ...prev, ...newPostsTemp }));

      setCursor(results.cursor);
    }
    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && cursor) {
          fetchData(cursor);
        }
      },
      { threshold: 0 }
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  useEffect(() => {
    setPosts({} as INewPost);
    setCursor('');
    fetchData('');
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reach]);

  async function fetchProfile() {
    try {
      if (!pubky) return;
      const userProfile = await getUserIndexed(pubky);

      if (userProfile) {
        setPic(userProfile.profile?.image || '/images/Userpic.png');
        setName(userProfile.profile?.name || 'Loading...');
        setHandler(pubky);
      }
    } catch (error) {
      console.log(error);
    }
  }

  {
    /**const postsLayoutClassName =
    layout === 'sidebar'
      ? layouts[layout].posts
      : `grid ${layouts[layout].layout} gap-6`;
  const sidebarClassName = `hidden ${
    layout === 'sidebar' && 'xl:inline-flex w-full'
  }`; */
  }

  const handleSubmit = async () => {
    if (sendingPost) {
      return;
    }
    try {
      setSendingPost(true);

      const newPost = await createPost(content);
      if (newPost) {
        setPosts((prev: INewPost) => ({
          ...{ [newPost.uri]: newPost },
          ...prev,
        }));
      }
      setContent('');
    } catch (error) {
      console.log(error);
    } finally {
      setSendingPost(false);
    }
  };

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Streams" />
      <Content.Grid className={'grid grid-cols-5 gap-4'}>
        <Sidebar className="hidden xl:block">
          <Filter.Reach />
          <Filter.Sort />
          <div className="self-start sticky top-[160px]">
            <Filter.Layout />
            <Filter.Content />
          </div>
        </Sidebar>
        <PostsLayout className="col-span-5 xl:col-span-4 2xl:col-span-3 flex-col inline-flex gap-6">
          <div className="p-6 rounded-2xl border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
            <div className="justify-start items-center gap-2 flex">
              <Image
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
                alt="user-image"
                src={pic}
              />
              <Typography.Body variant="medium-bold">{name}</Typography.Body>
              <Typography.Label className="text-opacity-30">
                {minifyPubky(handler)}
              </Typography.Label>
            </div>
            <div className="w-full flex justify-between gap-6 items-start inline-flex">
              <Input.CursorArea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setContent(e.target.value)
                }
                value={content}
                className="w-[450px] h-auto mt-4"
                placeholder="What's in your mind"
              />
              <Button.Large
                className="h-[25px]"
                icon={
                  <Icon.PaperPlaneRight color={!content ? 'gray' : 'white'} />
                }
                disabled={!content}
                loading={sendingPost}
                onClick={
                  content && !sendingPost ? () => handleSubmit() : undefined
                }
              >
                Publish
              </Button.Large>
            </div>
          </div>
          {Object.keys(posts).map((key) => (
            <Post key={posts[key].id} post={posts[key]} />
          ))}
          {Object.keys(posts).length === 0 && !loading && (
            <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
              <Typography.H2 className="font-normal text-opacity-50">
                No posts yet.
              </Typography.H2>
            </div>
          )}
          {loading && Loading(Object.keys(posts).length)}
        </PostsLayout>
        <Sidebar className="hidden 2xl:block">
          <WhoFollow />
          <HotTags />
          {/** <ActiveFriends /> */}
        </Sidebar>
      </Content.Grid>
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
