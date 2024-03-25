'use client';

import { Content } from '@social/ui-shared';
import { Profile } from './components';
import { CreatePost, Header, Post, PostsLayout } from '../components';
import { useClientContext } from '../../contexts/client';
import { useEffect, useState } from 'react';

export default function Index() {
  const { pubkey, getProfile, listPosts } = useClientContext();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('Loading...');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const profileInfo = await getProfile();
        if (profileInfo) {
          setPic(profileInfo?.image || '/images/Userpic.png');
          setName(profileInfo?.name || '');
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubkey, getProfile]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (!pubkey) return;
        const results = await listPosts(pubkey);
        if (!results.value.list) return;
        setPosts(results.value.list);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPosts();
  }, [pubkey, listPosts]);

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
          {posts.map((post, index) => (
            <Post key={index} postId={post} />
          ))}
        </PostsLayout>
        <Profile.Sidebar />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
