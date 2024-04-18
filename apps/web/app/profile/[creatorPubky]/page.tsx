/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { Content, Icon, Typography } from '@social/ui-shared';
import { Profile } from '../components';
import { Profile as ProfileCommon } from '../components';
import {
  CreatePost,
  Header,
  Post,
  PostsLayout,
  Skeleton,
} from '../../components';
import { useClientContext } from '../../../contexts/client';

export default function Index({
  params,
}: {
  params: { creatorPubky: string };
}) {
  const { pubky, getUserIndexed, getProfile, listUserFeed } =
    useClientContext();
  const creatorPubky = params.creatorPubky;

  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('Loading...');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const loader = useRef(null);

  async function fetchProfile() {
    try {
      if (pubky === creatorPubky) {
        const userProfile = await getProfile();
        if (userProfile) {
          setPic(userProfile.image || '/images/Userpic.png');
          setName(userProfile.name || 'Loading...');
        }
        return;
      }
      const userProfile = await getUserIndexed(creatorPubky);

      if (userProfile) {
        setPic(userProfile.profile?.image || '/images/Userpic.png');
        setName(userProfile.profile?.name || 'Loading...');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPosts(pointer: string) {
    try {
      setLoading(true);
      if (!creatorPubky) return;
      const results = await listUserFeed(creatorPubky, pointer);

      if (results && results.feed) {
        if (cursor) {
          setPosts((prev) => [...prev, ...results.feed]);
        } else {
          setPosts(results.feed);
        }
        setCursor(results.cursor);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && cursor) {
          fetchPosts(cursor);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, [cursor]);

  useEffect(() => {
    fetchProfile();
    fetchPosts(cursor);
  }, [creatorPubky]);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Profile" />
      <div>
        <ProfileCommon.HeaderBackground />
        <Content.Grid className="flex flex-col text-center lg:flex-row items-center sm:justify-between relative z-10">
          <ProfileCommon.Handle
            username={name}
            className="order-2 lg:order-1"
          />
          <ProfileCommon.Avatar
            username={name}
            src={pic}
            className="order-1 lg:order-2"
          />
        </Content.Grid>
      </div>
      <Content.Grid className="grid grid-cols-3 gap-4">
        <PostsLayout className="flex flex-col col-span-3 xl:col-span-2 gap-6">
          {loading && <Skeleton.Post size={'normal'} />}
          {posts.map((post, index) => (
            <Post key={index} post={post} />
          ))}
          {posts.length === 0 && !loading && (
            <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
              <Typography.H2 className="font-normal text-opacity-50">
                No posts yet.
              </Typography.H2>
            </div>
          )}
          {loading && (
            <div className="flex w-full justify-center">
              <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
            </div>
          )}
        </PostsLayout>
        <Profile.Sidebar
          creatorPubky={pubky === creatorPubky ? '' : creatorPubky}
        />
      </Content.Grid>
      <CreatePost />
      {posts.length > 0 && <div ref={loader} />}
    </Content.Main>
  );
}
