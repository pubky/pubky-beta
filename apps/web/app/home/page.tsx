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
import { useState } from 'react';

import { Client } from '@pubky/sdk'
console.log({ Client })

type Layout = 'sidebar' | 'grid' | 'columns' | 'list';

type Layouts = {
  [key in 'sidebar' | 'grid' | 'columns' | 'list']: {
    layout: string;
    posts: string;
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
          <Post size={layout === 'list' ? 'full' : 'normal'} />
          <Post size={layout === 'list' ? 'full' : 'normal'} />
          <Post size={layout === 'list' ? 'full' : 'normal'} />
          <Post size={layout === 'list' ? 'full' : 'normal'} />
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
