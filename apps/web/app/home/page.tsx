'use client';

import { Content } from '@social/ui-shared';
import {
  ActiveFriends,
  CreatePost,
  Header,
  HotTags,
  Post,
  PostsLayout,
  Sidebar,
  WhoFollow,
} from '../components';
import { DropDown } from '../components/DropDown';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../contexts/client';

type Layout = 'sidebar' | 'grid' | 'columns' | 'list';

type Layouts = {
  [key in 'sidebar' | 'grid' | 'columns' | 'list']: {
    layout: string;
    posts: string;
  };
};

type PostUri = {
  key: string;
  uri: string;
  value: {
    hash: string;
    timestamp: number;
  };
};

const layouts: Layouts = {
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
};

export default function Index() {
  const [layout] = useState<Layout>('sidebar');
  const { listPosts, pubkey } = useClientContext();
  const [posts, setPosts] = useState<PostUri[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!pubkey) return;
      const results = await listPosts(pubkey);
      setPosts(results.value.list);
      console.log(results.value.list[0]);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPosts, pubkey]);

  const postsLayoutClassName =
    layout === 'sidebar'
      ? layouts[layout].posts
      : `grid ${layouts[layout].layout} gap-6`;
  const sidebarClassName = `hidden ${layout === 'sidebar' && 'xl:inline-flex'}`;

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Streams">
        <div className="hidden lg:flex gap-6 items-center">
          <DropDown.Content />
          <DropDown.Reach />
          <DropDown.SortPosts />
          <DropDown.Layout />
        </div>
      </Header>
      <Content.Grid
        className={layout === 'sidebar' ? 'grid grid-cols-3 gap-6' : ''}
      >
        <PostsLayout className={postsLayoutClassName}>
          {posts.map((post, index) => (
            <Post
              key={index}
              postId={post}
              size={layout === 'list' ? 'full' : 'normal'}
            />
          ))}
        </PostsLayout>
        <Sidebar className={sidebarClassName}>
          <WhoFollow />
          <HotTags />
          <ActiveFriends />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
