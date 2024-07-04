'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';
import { CreatePost, Header, Post, PostsLayout } from '@/components';
import { useClientContext } from '@/contexts';
import { IPost, INewPost } from '@/types';
import { Utils } from '@social/utils-shared';
import Skeletons from '@/components/Skeletons';
import { Profile } from '../components';
import { Profile as ProfileCommon } from '../components';

export default function Index({
  params,
}: {
  params: { creatorPubky: string };
}) {
  const {
    pubky,
    getUserIndexed,
    getProfile,
    listUserFeed,
    getPost,
    posts,
    setPosts,
  } = useClientContext();
  const creatorPubky = params.creatorPubky;

  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('Loading...');
  const [handler, setHandler] = useState('');
  const [loading, setLoading] = useState(true);
  const [userExist, setUserExist] = useState(true);
  const [cursor, setCursor] = useState('');
  const [parentPosts, setParentPosts] = useState<{
    [key: string]: IPost | null;
  }>({});
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

      if (userProfile && userProfile.profile) {
        setPic(userProfile.profile?.image || '/images/Userpic.png');
        setName(userProfile.profile?.name || 'Loading...');
        setHandler(creatorPubky);
      } else {
        setUserExist(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPosts(
    pointer: string,
    cancellationToken: { cancelled: boolean }
  ) {
    try {
      setLoading(true);
      if (!creatorPubky) return;
      const results = await listUserFeed(creatorPubky, pointer);

      if (cancellationToken.cancelled) return;

      if (results && results.feed) {
        const newPostsTemp = await Promise.all(
          results.feed.map(async (post: IPost) => {
            let parentPost: IPost | null = null;
            if (post.post.parent) {
              parentPost = await fetchParentPost(post.post.parent);
              setParentPosts((prev) => ({
                ...prev,
                [post.post.parent!]: parentPost,
              }));
            }
            return post;
          })
        );

        const postsMap = newPostsTemp.reduce((acc: INewPost, post) => {
          acc[post.id] = post;
          return acc;
        }, {});

        setPosts((prev: INewPost) => ({ ...prev, ...postsMap }));

        setCursor(results.cursor);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchParentPost(parentUri: string): Promise<IPost | null> {
    try {
      const parentPost = await getPost(parentUri);
      return parentPost;
    } catch (error) {
      console.error('Error fetching parent post:', error);
      return null;
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && cursor) {
          const cancellationToken = { cancelled: false };
          fetchPosts(cursor, cancellationToken);
          return () => {
            cancellationToken.cancelled = true;
          };
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
    const cancellationToken = { cancelled: false };
    fetchPosts('', cancellationToken);
    return () => {
      cancellationToken.cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content.Main>
      <Header className="hidden md:block" />
      {userExist ? (
        <>
          <div>
            <Content.Grid className="flex flex-col text-start lg:flex-row items-center sm:justify-between relative">
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
            <PostsLayout className="flex flex-col col-span-3 xl:col-span-2 gap-6  mt-[10px]">
              {Object.keys(posts).map((key) => {
                const post = posts[key];
                const parentUri = post?.post?.parent;
                const parentPost = parentUri ? parentPosts[parentUri] : null;

                return (
                  <div key={post.id}>
                    {parentPost ? (
                      <Post
                        fullContent
                        post={parentPost}
                        className="border-0"
                        line
                      />
                    ) : parentUri ? (
                      <div className="relative ml-4 mb-8 px-6 py-2 bg-white bg-opacity-10 rounded-2xl w-[300px]">
                        <Typography.Body
                          variant="small"
                          className="text-opacity-50"
                        >
                          This post was not found or has been deleted by its
                          author.
                        </Typography.Body>
                        <div className="absolute -ml-1 mt-1.5 border-l-2 border-neutral-800 h-[35px]" />
                      </div>
                    ) : null}
                    <Post fullContent post={post} />
                  </div>
                );
              })}
              {Object.keys(posts).length === 0 && !loading && (
                <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
                  <Typography.H2 className="font-normal text-opacity-50">
                    No posts yet.
                  </Typography.H2>
                </div>
              )}
              {loading && <Skeletons.Simple />}
            </PostsLayout>
            <Profile.Sidebar creatorPubky={creatorPubky} />
          </Content.Grid>
          <CreatePost />
          <div ref={loader} />
        </>
      ) : (
        <Content.Grid>
          <div className="px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
            <Typography.Body
              variant="small"
              className="text-opacity-50 text-center"
            >
              This profile was not found or has been deleted by its author.
              <Link
                href="/home"
                className="ml-2 text-fuchsia-500 text-opacity-80 hover:text-opacity-100 cursor-pointer"
              >
                Go home
              </Link>
            </Typography.Body>
          </div>
        </Content.Grid>
      )}
    </Content.Main>
  );
}
