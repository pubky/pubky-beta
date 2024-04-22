'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Content, Icon, Typography } from '@social/ui-shared';
import { CreatePost, Header } from '../components';
import { HotTags } from './components';
import { DropDown } from '../components/DropDown';
import { useClientContext } from '../../contexts/client';
import { useFilterContext } from '../../contexts/filters';
import { ITaggedPost } from '../../types';

export default function Index() {
  const router = useRouter();
  const {
    pubky,
    getHotTags,
    setRefreshList,
    setSearchTags,
    searchTags,
    listFollowers,
    listFollowing,
  } = useClientContext();
  const { hotTagsReach } = useFilterContext();
  const [hotTags, setHotTags] = useState<ITaggedPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTags() {
    try {
      if (!pubky) return;

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
        setLoading(false);
      } else if (result) {
        setHotTags(result);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotTagsReach]);

  const handleTagSearch = (tag: string) => {
    if (searchTags.includes(tag)) return;

    if (searchTags.length < 3) {
      setSearchTags([...searchTags, tag]);
    } else {
      const newSearchTags = [...searchTags.slice(1), tag];
      setSearchTags(newSearchTags);
    }
    setRefreshList(true);
    router.push('/search');
  };

  return (
    <Content.Main>
      <Header className="w-52 xl:w-36 hidden md:block" title="Hot&#160;Tags">
        <div className="hidden lg:flex gap-6 items-center">
          <DropDown.HotTagsReach />
          <DropDown.TagsTimeframe />
        </div>
      </Header>
      <Content.Grid className="flex-col flex gap-3">
        {loading ? (
          <div>
            <div className="flex w-full justify-center">
              <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
            </div>
            <Typography.Body
              variant="medium-bold"
              className="col-span-3 mt-2 flex justify-center items-center gap-6 text-gray-600"
            >
              Loading Hot Tags
            </Typography.Body>
          </div>
        ) : hotTags.length > 0 ? (
          hotTags.map((tag, index) => (
            <div className="flex gap-3" key={index}>
              <HotTags.Rank
                rank={index + 1}
                tag={`# ${tag.tag}`}
                onClick={() => handleTagSearch(tag.tag)}
                color="amber"
                counter={`${tag.count} ${tag.count > 1 ? ' users' : ' user'}`}
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
                  src={fromItem.author?.profile?.image || '/images/Userpic.png'}
                />
              ))}
            </div>
          ))
        ) : (
          <Typography.H2 className="text-center font-normal text-opacity-50">
            No tags yet.
          </Typography.H2>
        )}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
