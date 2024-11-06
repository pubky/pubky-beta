'use client';

import { useEffect, useRef, useState, Fragment } from 'react';
import { Content, Icon, Menu, Typography } from '@social/ui-shared';
import * as Components from '@/components';
import { Filter } from '@/components/Filter';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { usePostStream, usePostReplies } from '@/hooks/usePost';
import { useRouter } from 'next/navigation';
import { Utils } from '@social/utils-shared';
import { UseUserMuted } from '@/hooks/useUser';
import CreateQuickReply from '@/components/CreateQuickReply';
import { HeaderSEO } from '@/components/HeaderSEO';

export default function Index() {
  const { layout } = useFilterContext();
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const [isFilterContentVisible, setIsFilterContentVisible] = useState(true);
  const filterContentRef = useRef(null);
  const drawerFilterRef = useRef<HTMLDivElement>(null);

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

  function getPostsLayoutClass(layout: string) {
    return layout === 'wide'
      ? 'col-span-10'
      : 'col-span-10 lg:col-span-9 xl:col-span-7';
  }

  function getSidebarClass(isFilterContentVisible: boolean) {
    return isFilterContentVisible ? '' : 'sticky top-[120px]';
  }

  return (
    <Content.Main>
      <HeaderSEO />
      <Components.Header className="hidden md:block" title="Feed" />
      <Components.RemindBackup />
      {layout === 'wide' && (
        <Components.ButtonFilters onClick={() => setDrawerFilterOpen(true)} />
      )}
      <Content.Grid className="grid grid-cols-10 gap-6">
        {layout !== 'wide' && (
          <Components.Sidebar className="col-span-1 hidden lg:block">
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
          id="posts-feed"
          className={`${getPostsLayoutClass(
            layout
          )} flex-col inline-flex gap-3 lg:ml-[70px] xl:ml-[45px]`}
        >
          <Components.CreateQuickPost largeView={layout === 'wide'} />
          <Timeline />
        </Components.PostsLayout>
        {layout !== 'wide' && (
          <Components.Sidebar className="col-span-2 hidden xl:block">
            <Components.WhoFollow />
            <Components.Influencers />
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
    </Content.Main>
  );
}

const Timeline = () => {
  const limit = 10;
  const [skip, setSkip] = useState(0);

  const { reach, layout, sort } = useFilterContext();
  const { pubky, timeline, setTimeline } = usePubkyClientContext();
  const { data, isLoading, isError } = usePostStream(
    pubky,
    skip,
    limit,
    reach,
    sort
  );
  const { data: mutedUsers } = UseUserMuted(pubky ?? '');

  useEffect(() => {
    setSkip(0);
    setTimeline([]);
  }, [reach]);

  useEffect(() => {
    if (!isLoading && data) {
      if (skip === 0) {
        setTimeline(data);
        return;
      }

      if (!timeline) return;

      const timelineCopy = [...timeline];

      setTimeline([...timelineCopy, ...data]);
    }
  }, [data, isLoading, reach]);

  const fetchMorePosts = () => {
    if (isError) return;

    const newSkip = skip + limit;

    setSkip(newSkip);
  };

  const loader = useInfiniteScroll(fetchMorePosts, isLoading);

  return (
    <div className="flex-col inline-flex gap-3">
      {timeline && timeline?.length > 0
        ? timeline
            .filter((post) => !mutedUsers?.includes(post?.details?.author))
            .map((post, index) => (
              <Fragment key={`${index}-${post.details.id}`}>
                {post?.details?.content === '[DELETED]' ? (
                  // && !post?.counts?.replies
                  ''
                ) : (
                  <div>
                    <Components.Post
                      post={post}
                      largeView={layout === 'wide'}
                      line={Boolean(post?.relationships?.replied)}
                    />
                    {post?.counts?.replies > 0 && (
                      <PostReplies homeView post={post} layout={layout} />
                    )}
                  </div>
                )}
              </Fragment>
            ))
        : !isLoading && (
            <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
              <Typography.H2 className="font-normal text-opacity-50">
                No posts
              </Typography.H2>
            </div>
          )}
      {isLoading && !isError && (
        <div className="mt-4">
          <Components.Skeleton.Simple />
        </div>
      )}
      <div ref={loader} />
    </div>
  );
};

const PostReplies = ({ post, layout, homeView = false }) => {
  const { pubky } = usePubkyClientContext();
  const { data: replies } = usePostReplies(
    post.details.author,
    post.details.id
  );
  //const [showAllReplies, setShowAllReplies] = useState(false);
  const { data: mutedUsers } = UseUserMuted(pubky ?? '');
  const router = useRouter();
  const lineBaseCSS = `ml-[12px] absolute border-neutral-800 after:content-[' * '] after:bg-neutral-800 after:w-[2px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[2px]`;
  const lineHorizontalCSS = (
    <div className="absolute ml-[10px]">
      <Icon.LineHorizontal size="14" color="#262626" />
    </div>
  );
  const lineBaseCSS2 = `ml-[11px] absolute border-neutral-800 after:content-[' * '] after:bg-neutral-800 after:w-[1.6px] after:h-[62px] after:block after:-mt-[38px] after:-ml-[1px]`;
  const lineHorizontalCSS2 = (
    <div className="absolute ml-[10px] mt-[22px]">
      <Icon.LineHorizontal size="14" color="#262626" />
    </div>
  );

  if (!replies || replies.length === 0) return null;

  const displayedReplies = replies.slice(0, 2);
  //showAllReplies
  //  ? replies.replies
  //  : replies.replies.slice(0, 2);
  const repliesLeft = post?.counts?.replies - displayedReplies.length;

  return (
    <div className="mt-3 flex flex-col gap-3">
      {displayedReplies
        .filter((post) => !mutedUsers?.includes(post?.details?.author))
        .map((reply) => (
          <Components.Post
            key={reply.details.id}
            post={reply}
            largeView={layout === 'wide'}
            line={Boolean(reply?.relationships?.replied)}
            homeView={homeView}
          />
        ))}
      {repliesLeft > 0 && (
        //&& !showAllReplies
        <div>
          <div className={lineBaseCSS} />
          {lineHorizontalCSS}
          <Typography.Body
            variant="small-bold"
            //onClick={() => setShowAllReplies(true)}
            onClick={() => router.push(Utils.encodePostUri(post?.details?.uri))}
            className="cursor-pointer flex gap-1 items-center ml-8 hover:opacity-80"
          >
            <Icon.PlusCircle />
            {repliesLeft === 1 ? '1 more reply' : `${repliesLeft} more replies`}
          </Typography.Body>
        </div>
      )}
      {post?.details?.content !== '[DELETED]' && (
        <div className="relative">
          <div className={lineBaseCSS2} />
          {lineHorizontalCSS2}
          <CreateQuickReply post={post} />
        </div>
      )}
    </div>
  );
};

function useInfiniteScroll(fetchPosts: () => void, isLoading: boolean) {
  const loader = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading) {
          fetchPosts();
        }
      },
      { threshold: 0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [fetchPosts, isLoading]);

  return loader;
}
