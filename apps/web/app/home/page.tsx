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
  const [repliesMap, setRepliesMap] = useState<{ [key: string]: IPost[] }>({});
  const [postLevels, setPostLevels] = useState<{ [key: string]: number }>({});
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
      const newRepliesMap: { [key: string]: IPost[] } = {};
      const newPostLevels: { [key: string]: number } = {};
      const newPostsTemp = await Promise.all(
        results.feed.map(async (post: IPost) => {
          let parentPost: IPost | null = null;
          const parentUri = post.post.parent;

          if (parentUri) {
            parentPost = await fetchParentPost(parentUri);
            setParentPosts((prev) => ({
              ...prev,
              [parentUri]: parentPost,
            }));

            if (newRepliesMap[parentUri]) {
              newRepliesMap[parentUri].push(post);
            } else {
              newRepliesMap[parentUri] = [post];
            }

            let level = 1;
            let currentUri = parentUri;
            while (parentPosts[currentUri]) {
              level++;
              currentUri = parentPosts[currentUri]?.post?.parent || '';
            }
            newPostLevels[post.uri] = level;
          } else {
            newPostLevels[post.uri] = 0;
            return post;
          }
        })
      );

      setRepliesMap((prev) => ({ ...prev, ...newRepliesMap }));
      setPostLevels((prev) => ({ ...prev, ...newPostLevels }));

      const postsMap = newPostsTemp.reduce((acc: INewPost, post) => {
        if (post) {
          acc[post.id] = post;
        }
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
      if (
        drawerFilterRef.current &&
        !drawerFilterRef.current.contains(event.target as Node)
      ) {
        setDrawerFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, [drawerFilterRef]);

  {
    /** function renderParentPost(
    parentPost: IPost,
    parentUri: string | undefined,
    layout: string
  ) {
    if (parentPost) {
      return (
        <Components.Post post={parentPost} largeView={layout === 'wide'} />
      );
    }

    if (parentUri) {
      return (
        <div className="relative ml-4 mb-8 px-6 py-2 bg-white bg-opacity-10 rounded-2xl w-[300px]">
          <Typography.Body variant="small" className="text-opacity-50">
            This post was not found or has been deleted by its author.
          </Typography.Body>
          <div className="absolute -ml-1 mt-2 border-l-2 border-neutral-800 h-[44px]" />
        </div>
      );
    }

    return null;
  }
    */
  }

  function renderPostWithReplies(
    post: IPost,
    layout: string,
    renderedPosts: Set<string>
  ) {
    if (renderedPosts.has(post.uri)) {
      return null;
    }
    renderedPosts.add(post.uri);

    const level = postLevels[post.uri] || 0;
    const marginClass = level > 0 ? `ml-${level * 6}` : '';

    return (
      <div className={`flex flex-col gap-3 ${marginClass}`} key={post.id}>
        <Components.Post
          largeView={layout === 'wide'}
          post={post}
          line={Boolean(post?.post?.parent)}
        />
        {repliesMap[post.uri]?.map((reply) =>
          renderPostWithReplies(reply, layout, renderedPosts)
        )}
      </div>
    );
  }

  function renderPostsInOrder(layout: string) {
    const renderedPosts = new Set<string>();

    return Object.keys(posts).flatMap((key) => {
      const post = posts[key];
      const parentUri = post?.post?.parent;

      if (!parentUri || !renderedPosts.has(parentUri)) {
        return renderPostWithReplies(post, layout, renderedPosts);
      }

      return null;
    });
  }

  function getPostsLayoutClass(layout: string) {
    return layout === 'wide'
      ? 'col-span-5'
      : 'col-span-5 lg:col-span-4 xl:col-span-3';
  }

  function getSidebarClass(isFilterContentVisible: boolean) {
    return isFilterContentVisible ? '' : 'sticky top-[120px]';
  }

  return (
    <Content.Main>
      <Components.Header className="hidden md:block" title="Feed" />
      <Components.RemindBackup />
      {layout === 'wide' && (
        <Components.ButtonFilters onClick={() => setDrawerFilterOpen(true)} />
      )}
      <Content.Grid className="grid grid-cols-5 gap-6">
        {layout !== 'wide' && (
          <Components.Sidebar className="hidden lg:block">
            <div
              className={`self-start ${getSidebarClass(
                isFilterContentVisible
              )}`}
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
          id='posts-feed' className={`${getPostsLayoutClass(
            layout
          )} flex-col inline-flex gap-3`}
        >
          <Components.CreateQuickPost largeView={layout === 'wide'} />
          {renderPostsInOrder(layout)}
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
            <Components.Feedback />
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
