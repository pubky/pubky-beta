'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';
import {
  ActiveFriends,
  CreatePost,
  Header,
  Sidebar,
  WhoFollow,
} from '../../components';
import { HotTags } from './components';
import { DropDown } from '../../components/DropDown';
import { useClientContext } from '../../contexts/client';
import { useFilterContext } from '../../contexts/filters';
import { ITaggedPost } from '../../types';
import Skeletons from '../../components/Skeletons';

export default function Index() {
  const router = useRouter();
  const { pubky, getHotTags, listFollowers, listFollowing } =
    useClientContext();
  const { hotTagsReach } = useFilterContext();
  const [hotTags, setHotTags] = useState<ITaggedPost[]>([]);
  const [loadingReachTags, setLoadingReachTags] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchTags() {
    try {
      if (!pubky) return;
      setLoadingReachTags(true);

      let filteredTags;
      const result = await getHotTags();

      if (result) {
        if (hotTagsReach === 'followers') {
          const followers = await listFollowers(pubky);
          filteredTags = result.filter((tag) => {
            return (
              followers &&
              followers.followers.some((follower) => {
                return tag.from.some(
                  (fromItem) =>
                    fromItem.author.id === follower.uri.replace('pubky:', '')
                );
              })
            );
          });
        } else if (hotTagsReach === 'following') {
          const following = await listFollowing(pubky);
          filteredTags = result.filter((tag) => {
            return (
              following &&
              following.following.some((following) => {
                return tag.from.some(
                  (fromItem) =>
                    fromItem.author.id === following.uri.replace('pubky:', '')
                );
              })
            );
          });
        } else if (hotTagsReach === 'friends') {
          const followers = await listFollowers(pubky);
          const following = await listFollowing(pubky);

          const followersIds = new Set(
            followers?.followers?.map((follower) =>
              follower.uri.replace('pubky:', '')
            ) || []
          );

          const mutualContacts =
            following?.following?.filter((following) =>
              followersIds.has(following.uri.replace('pubky:', ''))
            ) || [];

          const friends = {
            count: mutualContacts.length,
            friends: mutualContacts,
          };

          filteredTags = result.filter((tag) => {
            return (
              friends &&
              friends.friends.some((friend) => {
                return tag.from.some(
                  (fromItem) =>
                    fromItem.author.id === friend.uri.replace('pubky:', '')
                );
              })
            );
          });
        }
      }

      if (filteredTags) {
        setHotTags(filteredTags);
      } else if (result) {
        setHotTags(result);
      }
      setLoading(false);
      setLoadingReachTags(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotTagsReach]);

  {
    /** const handleTagSearch = (tag: string) => {
    if (searchTags.includes(tag)) return;

    if (searchTags.length < 3) {
      setSearchTags([...searchTags, tag]);
    } else {
      const newSearchTags = [...searchTags.slice(1), tag];
      setSearchTags(newSearchTags);
    }
    router.push('/search');
  };
  */
  }

  return (
    <Content.Main>
      <Header className="hidden md:block" title="HotTags" />
      <Content.Grid className='flex w-full justify-between items-start inline-flex"'>
        <div className="w-full flex-col inline-flex gap-3">
          <div className="flex gap-6 mb-6">
            <DropDown.HotTagsReach type="text" subtitle="Reach" />
            {/**<DropDown.TagsTimeframe disabled type="text" subtitle="Timeframe" />*/}
          </div>
          {loading ? (
            <div className="w-full">
              <Skeletons.Simple />
            </div>
          ) : hotTags.length > 0 ? (
            loadingReachTags ? (
              <Skeletons.Simple />
            ) : (
              hotTags.map((tag, index) => (
                <div className="flex gap-3" key={index}>
                  <HotTags.Rank
                    rank={index + 1}
                    tag={tag.tag}
                    onClick={() => router.push(`/search?tags=${tag.tag}`)}
                    color="fuchsia"
                    counter={`${tag.count}`}
                  />
                  {tag?.from.slice(0, 5).map((fromItem, fromIndex: number) => (
                    <Image
                      width={32}
                      height={32}
                      alt={`pic-${fromIndex + 1}`}
                      key={fromIndex}
                      className={`w-[32px] h-[32px] rounded-full ${
                        fromIndex !== 0 ? '-ml-5' : ''
                      }`}
                      src={
                        fromItem.author?.profile?.image || '/images/Userpic.png'
                      }
                    />
                  ))}
                </div>
              ))
            )
          ) : (
            <Typography.H2 className="text-center font-normal text-opacity-50">
              No tags yet.
            </Typography.H2>
          )}
        </div>
        <Sidebar className="self-start sticky top-[120px] hidden xl:block w-[20%]">
          <WhoFollow />
          <ActiveFriends />
        </Sidebar>{' '}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
