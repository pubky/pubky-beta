'use client';

import { Content } from '@social/ui-shared';
import { Profile } from './components';
import { CreatePost, Header, Post, PostsLayout } from '../components';
import { useProfileContext } from '../../contexts/profile';
import { useEffect, useState } from 'react';

export default function Index() {
  const { getProfile } = useProfileContext();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('');

  useEffect(() => {
    async function fetchData() {
      const profileInfo = await getProfile();
      if (profileInfo) {
        setPic(profileInfo?.pic || '/images/Userpic.png');
        setName(profileInfo?.name || '');
      }
    }
    fetchData();
  }, [getProfile]);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Profile" />
      <div>
        <Profile.HeaderBackground />
        <Content.Grid className="flex flex-col text-center lg:flex-row items-center sm:justify-between relative z-10">
          <Profile.Handle username={name} className="order-2 lg:order-1" />
          <Profile.Avatar
            username={name}
            src={pic}
            className="order-1 lg:order-2"
          />
        </Content.Grid>
      </div>
      <Content.Grid className="grid grid-cols-3 gap-4">
        <PostsLayout className="flex flex-col col-span-3 xl:col-span-2 gap-6">
          <Post />
          <Post />
        </PostsLayout>
        <Profile.Sidebar />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
