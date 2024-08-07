'use client';

import { useEffect, useRef, useState } from 'react';
import { Content, Icon, Menu } from '@social/ui-shared';

import * as Components from '@/components';
import { Filter } from '@/components/Filter';
import { useClientContext, useFilterContext } from '@/contexts';
import { IPost, INewPost } from '@/types';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';

export default function MapLayout() {
  const { reach, sort } = useFilterContext();
  const { listGlobalPosts, posts, setPosts } = useClientContext();
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const [cursor, setCursor] = useState('');

  const loader = useRef(null);
  const drawerFilterRef = useRef<HTMLDivElement>(null);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  const fetchData = async (
    pointer: string,
    cancellationToken: { cancelled: boolean }
  ) => {
    const results = await listGlobalPosts(pointer, reach, sort);

    if (cancellationToken.cancelled) return;
    if (results && results.feed) {
      const newPostsTemp = await Promise.all(
        results.feed.map(async (post: IPost) => post)
      );

      const postsMap = newPostsTemp.reduce((acc: INewPost, post) => {
        acc[post.id] = post;
        return acc;
      }, {});

      setPosts((prev: INewPost) => ({ ...prev, ...postsMap }));

      setCursor(results.cursor);
    }
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

  useEffect(() => {
    setLoadingMorePosts(true);
    setTimeout(() => {
      fetchData(cursor, { cancelled: false });
      setLoadingMorePosts(false);
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  return (
    <Content.Main>
      <Components.Header title="Map" />
      <Components.RemindBackup />
      <Components.ButtonFilters onClick={() => setDrawerFilterOpen(true)} />
      <Content.Grid className={'grid grid-cols-5 gap-6'}>
        <Components.PostsLayout className="col-span-5 flex-col inline-flex gap-3">
          <div
            className={`transition-all fixed bottom-0 left-0 w-full p-4 text-center text-gray-500 justify-center flex flex-row`}
          >
            {loadingMorePosts && (
              <div className="flex flex-row">
                <Icon.LoadingSpin size="24" className="animate-bounce" />
                <span className="ml-1">Waiting for more posts...</span>
              </div>
            )}
            {!loadingMorePosts && (
              <div className="flex flex-row">
                <Icon.ArrowUp size="24" className="animate-bounce" />
                <span className="ml-1">Updating markers...</span>
              </div>
            )}
          </div>
          <Components.CreateQuickPost largeView={false} />
          <div className="rounded-[15px] overflow-hidden col-span-3 flex justify-center">
            <MapContainer
              center={{
                lat: 21.505,
                lng: -0.09,
              }}
              zoom={3}
              scrollWheelZoom={true}
              style={{
                height: 'calc(100vh - 400px)',
                width: '100%',
                zIndex: 0,
              }}
              markerZoomAnimation={true}
            >
              <TileLayer
                attribution=""
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {Object.keys(posts).map((key) => {
                const post = posts[key];
                if (post?.post?.marker === undefined) return;

                const customIcon = L.icon({
                  iconUrl: post.author.profile.image,
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  iconRetinaUrl: post.author.profile.image,
                });

                return (
                  <Marker
                    key={post.id}
                    position={post.post.marker}
                    icon={customIcon}
                  >
                    <Popup
                      autoClose={true}
                      autoPan={true}
                      className="opacity-0"
                    >
                      <div className="flex flex-col gap-3" key={post.id}>
                        <div
                          style={{
                            width: '400px',
                            height: 'auto',
                            padding: '12px',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            borderRadius: '15px',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <Components.Post
                            post={post}
                            className="rounded-bl-none"
                            hidePK={true}
                          />
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </Components.PostsLayout>
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
    </Content.Main>
  );
}
