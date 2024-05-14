'use client';

import { useEffect, useRef, useState } from 'react';
import { Content, Icon, Typography } from '@social/ui-shared';
import { Profile } from '../components';
import { Profile as ProfileCommon } from '../components';
import { CreatePost, Header, Post, PostsLayout } from '../../../components';
import { useClientContext } from '../../../contexts/client';
import { IPost, INewPost } from '../../../types';
import { Utils } from '../../../utils';

export default function Index({
  params,
}: {
  params: { creatorPubky: string };
}) {
  const { pubky, getUserIndexed, getProfile, listUserFeed, posts, setPosts } =
    useClientContext();
  const creatorPubky = params.creatorPubky;

  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('Loading...');
  const [handler, setHandler] = useState('');
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
          setHandler(pubky);
        }
        return;
      }
      const userProfile = await getUserIndexed(creatorPubky);

      if (userProfile) {
        setPic(userProfile.profile?.image || '/images/Userpic.png');
        setName(userProfile.profile?.name || 'Loading...');
        setHandler(creatorPubky);
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
        const newPostsTemp = results.feed.reduce(
          (acc: INewPost, post: IPost) => {
            acc[post.id] = post;
            return acc;
          },
          {}
        );

        setPosts((prev: INewPost) => ({ ...prev, ...newPostsTemp }));

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  useEffect(() => {
    setPosts({} as INewPost);
    fetchProfile();
    fetchPosts(cursor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Profile" />
      <div>
        <Content.Grid className="flex flex-col text-start lg:flex-row items-center sm:justify-between relative z-10">
          <ProfileCommon.Handle
            username={Utils.minifyText(name, 17)}
            className="order-2 lg:order-1"
            pubkey={Utils.minifyPubky(handler)}
          />
          <ProfileCommon.Avatar
            username={name}
            src={pic}
            className="order-1 lg:order-2"
          />
        </Content.Grid>
      </div>
      <Content.Grid className="grid grid-cols-3 gap-6">
        <PostsLayout className="flex flex-col col-span-3 xl:col-span-2 gap-6">
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
          {loading && (
            <>
              <div
                className={`flex w-full justify-center ${
                  Object.keys(posts).length === 0 ? 'mt-10' : 'mt-2'
                }`}
              >
                <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
              </div>
              <Typography.Body
                variant="medium-bold"
                className="col-span-3 -m-2 flex justify-center items-center gap-6 text-opacity-20"
              >
                Loading Posts
              </Typography.Body>
            </>
          )}
        </PostsLayout>
        <Profile.Sidebar creatorPubky={creatorPubky} />
      </Content.Grid>
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
