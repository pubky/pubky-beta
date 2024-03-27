/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button, Content } from '@social/ui-shared';
import { Profile } from './components';
import { CreatePost, Header, Post, PostsLayout, Skeleton } from '../components';
import { useClientContext } from '../../contexts/client';
import { useEffect, useState } from 'react';

export default function Index() {
  const { refreshList, setRefreshList, pubky, getProfile, listPosts } =
    useClientContext();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('Loading...');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [cursor, setCursor] = useState('');

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
  }, [getProfile]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (!pubky) return;

        const results = await listPosts(pubky, cursor);

        if (!results || !results.list) return;

        setPosts(results.list);

        if (results.list.length >= 5) {
          setShowLoadMore(true);
        }

        if (results.cursor) {
          setCursor(results.cursor);
        }

        setRefreshList(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPosts();
  }, [pubky]);

  useEffect(() => {
    async function refetchPosts() {
      try {
        if (!pubky) return;

        const results = await listPosts(pubky, '');

        if (!results || !results.list) return;

        setPosts(results.list);

        if (results.list.length >= 5) {
          setShowLoadMore(true);
        }

        if (results.cursor) {
          setCursor(results.cursor);
        }

        setRefreshList(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    if (refreshList) {
      setCursor('');
      refetchPosts();
    }
  }, [refreshList]);

  const handleLoadMore = async () => {
    try {
      if (!pubky) return;
      const results = await listPosts(pubky, cursor);
      if (!results || !results.list) return;
      setPosts((prev) => [...prev, ...results.list]);
      if (!results.cursor) {
        setShowLoadMore(false);
        return;
      }
      setCursor(results.cursor);
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
            <Post key={index} postId={post} />
          ))}
          {posts.length === 0 && !loading && (
            <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
              <div className="text-2xl text-gray-600">No posts yet.</div>
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
