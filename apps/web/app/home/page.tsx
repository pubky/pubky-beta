'use client';

import { useEffect, useRef, useState } from 'react';
import { Content, Menu, Typography } from '@social/ui-shared';

import * as Components from '@/components';
import Skeletons from '@/components/Skeletons';
import { Filter } from '@/components/Filter';
import { useClientContext, useFilterContext } from '@/contexts';
import { IPost, INewPost } from '@/types';

export default function Index() {
  const { reach, sort, layout } = useFilterContext();
  const { listGlobalPosts, getPost, posts, setPosts } = useClientContext();
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const [parentPosts, setParentPosts] = useState<{
    [key: string]: IPost | null;
  }>({});
  const [isFilterContentVisible, setIsFilterContentVisible] = useState(true);
  const loader = useRef(null);
  const filterContentRef = useRef(null);
  const drawerFilterRef = useRef<HTMLDivElement>(null);

  const fetchParentPost = async (parentUri: string): Promise<IPost | null> => {
    try {
      const parentPost = await getPost(parentUri);
      return parentPost;
    } catch (error) {
      console.error('Error fetching parent post:', error);
      return null;
    }
  };

  const fetchData = async (
    pointer: string,
    cancellationToken: { cancelled: boolean }
  ) => {
    setLoading(true);

    const results = await listGlobalPosts(pointer, reach, sort);

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
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && cursor) {
          const cancellationToken = { cancelled: false };
          fetchData(cursor, cancellationToken);
          return () => {
            cancellationToken.cancelled = true;
          };
        }
      },
      { threshold: 0 }
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  useEffect(() => {
    setPosts({} as INewPost);
    setCursor('');
    const cancellationToken = { cancelled: false };
    fetchData('', cancellationToken);
    return () => {
      cancellationToken.cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reach, sort]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsFilterContentVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (filterContentRef.current) {
      observer.observe(filterContentRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      {
        if (
          drawerFilterRef.current &&
          !drawerFilterRef.current.contains(event.target as Node)
        ) {
          setDrawerFilterOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, [drawerFilterRef]);

  return (
    <Content.Main>
      <Components.Header className="hidden md:block" title="Streams" />
      <Components.RemindBackup />
      {layout === 'wide' && (
        <Components.ButtonFilters
          onClick={() => setDrawerFilterOpen(true)}
        />
      )}
      <Content.Grid className={'grid grid-cols-5 gap-6'}>
        {layout !== 'wide' && (
          <Components.Sidebar className="hidden lg:block">
            <div
              className={`self-start ${
                isFilterContentVisible ? '' : 'sticky top-[120px]'
              }`}
            >
              <Filter.Reach />
              <Filter.Sort />
            </div>
            <div ref={filterContentRef}>
              <Filter.Layout />
              <Filter.Content />
            </div>
          </Components.Sidebar>
        )}
        <Components.PostsLayout
          className={`${
            layout === 'wide'
              ? 'col-span-5'
              : 'col-span-5 lg:col-span-4 xl:col-span-3'
          } flex-col inline-flex gap-3`}
        >
          <Components.CreateQuickPost largeView={layout === 'wide'} />
          {Object.keys(posts).map((key) => {
            const post = posts[key];
            const parentUri = post?.post?.parent;
            const parentPost = parentUri ? parentPosts[parentUri] : null;

            return (
              <div className="flex flex-col gap-3" key={post.id}>
                {parentPost ? (
                  <Components.Post
                    post={parentPost}
                    className="rounded-bl-none"
                    largeView={layout === 'wide'}
                  />
                ) : parentUri ? (
                  <div className="relative ml-4 mb-8 px-6 py-2 bg-white bg-opacity-10 rounded-2xl w-[300px]">
                    <Typography.Body
                      variant="small"
                      className="text-opacity-50"
                    >
                      This post was not found or has been deleted by its author.
                    </Typography.Body>
                    <div className="absolute -ml-1 mt-2 border-l-2 border-neutral-800 h-[44px]" />
                  </div>
                ) : null}
                <Components.Post
                  largeView={layout === 'wide'}
                  post={post}
                  line={parentPost ? true : false}
                />
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
        </Components.PostsLayout>
        {layout !== 'wide' && (
          <Components.Sidebar className="hidden xl:block">
            <Components.WhoFollow />
            <Components.ActiveFriends />
            <Components.HotTags />
          </Components.Sidebar>
        )}
      </Content.Grid>
      <Menu.Root
        position="left"
        drawerRef={drawerFilterRef}
        drawerOpen={drawerFilterOpen}
      >
        <div className="overflow-y-auto max-h-full no-scrollbar">
          <Filter.Reach />
          <Filter.Sort />
          <Filter.Layout setDrawerFilterOpen={setDrawerFilterOpen} />
          <Filter.Content />
        </div>
      </Menu.Root>
      <Components.CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
