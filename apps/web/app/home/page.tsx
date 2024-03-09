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

type Layout = 'sidebar' | 'grid' | 'columns' | 'list';

type Layouts = {
  [key in 'sidebar' | 'grid' | 'columns' | 'list']: {
    grid: string;
    posts: string;
  };
};

const layouts: Layouts = {
  sidebar: {
    grid: 'grid-cols-3',
    posts: 'col-span-3 xl:col-span-2',
  },
  grid: {
    grid: 'grid-cols-3',
    posts: '',
  },
  columns: {
    grid: 'grid-cols-2',
    posts: '',
  },
  list: {
    grid: 'grid-cols-1',
    posts: '',
  },
};

export default function Index() {
  const [layout] = useState<Layout>('sidebar');
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
      <Content.Grid className={`grid ${layouts[layout].grid} gap-4`}>
        {/* Layout dei post */}
        <PostsLayout className={layouts[layout].posts}>
          <Post size={layout === 'list' ? 'full' : 'normal'} />
        </PostsLayout>
        {/* Sidebar */}
        <Sidebar
          className={`hidden ${layout === 'sidebar' && 'xl:inline-flex'}`}
        >
          <WhoFollow />
          <HotTags />
          <ActiveFriends />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
