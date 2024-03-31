/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button, Content, Typography } from '@social/ui-shared';
import { Profile } from './components';
import { CreatePost, Header, Post, PostsLayout, Skeleton } from '../components';
import { useClientContext } from '../../contexts/client';
import { useEffect, useState } from 'react';

export default function Index() {
  const { pubky, refreshList, setRefreshList, getProfile, listUserFeed } =
    useClientContext();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('Loading...');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [cursor, setCursor] = useState('');

  async function fetchPosts() {
    try {
      if (!pubky) return;

      const results = await listUserFeed(pubky, cursor);

      if (!results || !results.feed) return;

      setPosts(results.feed);

      if (results.feed.length >= 5) {
        setShowLoadMore(true);
      }

      if (results.cursor) {
        setCursor(results.cursor);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (refreshList) {
      setCursor('');
      fetchPosts();
      setRefreshList(false);
    }
  }, [refreshList]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileInfo = await getProfile();

        if (profileInfo) {
          setPic(profileInfo?.image || '/images/Userpic.png');
          setName(profileInfo?.name || 'Loading...');
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchProfile();

    fetchPosts();
  }, [pubky]);

  const handleLoadMore = async () => {
    try {
      if (!pubky) return;

      const results = await listUserFeed(pubky, cursor);

      if (!results || !results.feed) return;

      setPosts((prev) => [...prev, ...results.feed]);

      if (results.feed.length >= 5) {
        setShowLoadMore(true);
      }

      if (results.cursor) {
        setCursor(results.cursor);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          {showLoadMore && (
            <Button.Large
              className="col-span-3 xl:col-span-2"
              variant="secondary"
              onClick={() => handleLoadMore()}
            >
              Load More
            </Button.Large>
          )}
        </PostsLayout>
        <Profile.Sidebar />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
