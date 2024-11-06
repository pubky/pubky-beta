'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Content, Menu, Typography } from '@social/ui-shared';
import {
  ButtonFilters,
  CreatePost,
  Feedback,
  Header,
  HotTags,
  Post,
  PostsLayout,
  Sidebar,
  WhoFollow,
  Influencers,
} from '@/components';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { Filter } from '@/components/Filter';
import Skeletons from '@/components/Skeletons';
import { usePostStream } from '@/hooks/usePost';
import { UseUserMuted } from '@/hooks/useUser';

const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { layout, reach, sort } = useFilterContext();
  const { pubky, searchTags, setSearchTags } = usePubkyClientContext();
  const { data, isLoading, isError } = usePostStream(
    pubky,
    0,
    5,
    reach,
    sort,
    searchTags
  );
  const { data: mutedUsers } = UseUserMuted(pubky ?? '');
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  //const [cursor, setCursor] = useState('');
  const [isFilterContentVisible, setIsFilterContentVisible] = useState(true);
  const filterContentRef = useRef(null);
  const drawerFilterRef = useRef<HTMLDivElement>(null);
  const loader = useRef(null);
  const tagMessage =
    searchTags.length > 1
      ? 'with these tags:'
      : searchTags.length === 1
      ? 'with this tag:'
      : '';

  // const fetchData = async (pointer: string, searchTags: string[]) => {
  //  setLoading(true);

  //  if (searchTags.length === 0) {
  //    setLoading(false);
  //    return;
  // }

  // const results = posts; //await listGlobalPosts(pointer, reach, sort, searchTags);

  //if (results && results.feed) {
  //  if (cursor) {
  //    setPosts((prev: IPost[]) => [...prev, ...results.feed]);
  //  } else {
  //    setPosts(results.feed);
  //  }
  //  setCursor(results.cursor);
  //  setLoading(false);
  //}
  //};

  {
    /**useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursor) {
          fetchData(cursor, searchTags);
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
  */
  }

  //useEffect(() => {
  // //setPosts([]);
  //  fetchData('', searchTags);
  //  // eslint-disable-next-line react-hooks/exhaustive-deps
  //}, [reach, sort, searchTags]);

  useEffect(() => {
    const search = searchParams.get('tags');

    if (search) {
      const tagsArray = search.split(',');
      setSearchTags(tagsArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const searchTagsString = searchTags.join(',');
    const searchUrl = searchTagsString
      ? `/search?tags=${searchTagsString}`
      : '/search';
    router.replace(searchUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTags]);

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
      <Header className="hidden md:block" title="Search" />
      {layout === 'wide' && (
        <ButtonFilters onClick={() => setDrawerFilterOpen(true)} />
      )}
      <Content.Grid className={'grid grid-cols-10 gap-6'}>
        {layout !== 'wide' && (
          <Sidebar className="col-span-1 hidden lg:block">
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
          </Sidebar>
        )}
        <PostsLayout
          className={`${getPostsLayoutClass(
            layout
          )} flex-col inline-flex gap-3 lg:ml-[70px] xl:ml-[45px]`}
        >
          {data && data?.length > 0
            ? data
                .filter((post) => !mutedUsers?.includes(post?.details?.author))
                .map(
                  (post) =>
                    post?.details?.content !== '[DELETED]' && (
                      <Post
                        key={post.details.id}
                        post={post}
                        largeView={layout === 'wide'}
                      />
                    )
                )
            : !isLoading && (
                <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
                  <Typography.H2 className="font-normal text-opacity-50">
                    No posts {tagMessage}
                  </Typography.H2>
                  <Typography.H2 className="font-normal">
                    {searchTags.map((searchTag, index) => (
                      <span key={`tag-${searchTag}`}>
                        {searchTag}
                        {index !== searchTags.length - 1 && ', '}
                      </span>
                    ))}
                  </Typography.H2>
                </div>
              )}
          {isLoading && !isError && <Skeletons.Simple />}
        </PostsLayout>
        {layout !== 'wide' && (
          <Sidebar className="col-span-2 hidden xl:block">
            <WhoFollow />
            <Influencers />
            <HotTags />
            <Feedback />
          </Sidebar>
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
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
};

export default function Index() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
