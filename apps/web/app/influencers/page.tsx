'use client';

import { Button, Content, Icon, PostUtil, Typography } from '@social/ui-shared';
import { CreatePost, Feedback, Header, Sidebar, WhoFollow } from '@/components';
import Skeletons from '@/components/Skeletons';
import Filter from '@/components/Filter';
import { usePubkyClientContext } from '@/contexts';
import { useInfluencersUsers } from '@/hooks/useUser';
import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';
import { Utils } from '@social/utils-shared';
import { useState } from 'react';

export interface LoadingInfluencers {
  [pubky: string]: boolean;
}

export default function Index() {
  const { pubky, follow, unfollow, createTagProfile, deleteTagProfile } =
    usePubkyClientContext();
  const {
    data: influencers,
    isLoading,
    isError,
  } = useInfluencersUsers(pubky, 0, 10);
  if (isError) console.error(isError);

  const [loadingInfluencers, setLoadingInfluencers] =
    useState<LoadingInfluencers>({});
  const [followed, setFollowed] = useState<{ [pubky: string]: boolean }>({});

  const handleAddProfileTag = async (creatorPubky: string, tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await createTagProfile(pubKeyToUse, tag);
    }
  };

  const handleDeleteProfileTag = async (creatorPubky: string, tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await deleteTagProfile(pubKeyToUse, tag);
    }
  };

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;
      setLoadingInfluencers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));
      setLoadingInfluencers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (pubkyUnfollow: string) => {
    try {
      if (!pubkyUnfollow) return;
      setLoadingInfluencers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true,
      }));

      const result = await unfollow(pubkyUnfollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));
      setLoadingInfluencers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Influencers" />
      <Content.Grid className="grid grid-cols-5 gap-4">
        <Sidebar className="self-start sticky top-[120px] hidden xl:block">
          <Filter.HotTagsReach disabled />
          <Filter.TagsTimeFrame disabled />
        </Sidebar>
        <div className="w-full flex-col inline-flex gap-3 col-span-5 xl:col-span-4 2xl:col-span-3">
          {isLoading ? (
            <div className="w-full">
              <Skeletons.Simple />
            </div>
          ) : (
            <>
              {influencers &&
                influencers.map((influencer) => {
                  const pubkeyUser =
                    pubky && influencer?.details?.id.includes(pubky);
                  const isFollowed =
                    followed[influencer?.details?.id] ||
                    influencer?.relationship?.following ||
                    false;

                  return (
                    <div key={influencer?.details?.id} className="w-full">
                      <div className="w-full">
                        <div className="flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
                          <Link
                            className="flex gap-2 w-full"
                            href={`/profile/${influencer?.details?.id}`}
                          >
                            <ImageByUri
                              width={48}
                              height={48}
                              uri={
                                influencer?.details?.image ||
                                '/images/Userpic.png'
                              }
                              alt={`profile-pic-${influencer?.details?.id}`}
                              className="rounded-full w-[48px] h-[48px] max-w-none"
                            />
                            <div className="flex-col justify-center items-start inline-flex">
                              <Typography.Body variant="medium-bold">
                                {influencer?.details.name &&
                                  Utils.minifyText(
                                    influencer?.details?.name,
                                    20
                                  )}
                              </Typography.Body>
                              <Typography.Label className="text-opacity-30 -mt-1">
                                {influencer?.details?.id &&
                                  Utils.minifyPubky(influencer?.details?.id)}
                              </Typography.Label>
                            </div>
                          </Link>
                          <div className="lg:flex justify-end gap-2 items-center lg:w-full">
                            {influencer?.tags?.slice(0, 3).map((tag, index) => {
                              const isTagFound = tag?.taggers?.some(
                                (fromItem) => fromItem === pubky
                              );

                              return (
                                <PostUtil.Tag
                                  key={index}
                                  clicked={false}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    isTagFound
                                      ? handleDeleteProfileTag(
                                          influencer?.details?.id,
                                          tag?.label
                                        )
                                      : handleAddProfileTag(
                                          influencer?.details?.id,
                                          tag?.label
                                        );
                                  }}
                                  color={
                                    tag?.label &&
                                    Utils.generateRandomColor(tag?.label)
                                  }
                                >
                                  <div className="flex gap-2 items-center">
                                    {Utils.minifyText(
                                      tag?.label.replace(' ', ''),
                                      10
                                    )}
                                    <Typography.Caption
                                      variant="bold"
                                      className="text-opacity-30"
                                    >
                                      {tag?.taggers_count}
                                    </Typography.Caption>
                                  </div>
                                </PostUtil.Tag>
                              );
                            })}
                          </div>
                          <div className="flex-col justify-start items-start gap-1 inline-flex">
                            <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
                              Tags
                            </Typography.Label>
                            <Typography.Body variant="medium-bold">
                              {influencer?.counts?.tags ?? 0}
                            </Typography.Body>
                          </div>
                          <div className="flex-col justify-start items-start gap-1 inline-flex">
                            <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
                              Posts
                            </Typography.Label>
                            <Typography.Body variant="medium-bold">
                              {influencer?.counts?.posts ?? 0}
                            </Typography.Body>
                          </div>
                          <div className="flex gap-4">
                            {pubkeyUser ? (
                              <Button.Medium
                                className="w-[104px] bg-transparent cursor-default"
                                icon={<Icon.Check />}
                              >
                                Me
                              </Button.Medium>
                            ) : isLoading ? (
                              <Button.Medium disabled loading={isLoading}>
                                Loading
                              </Button.Medium>
                            ) : isFollowed ? (
                              <Button.Medium
                                onClick={
                                  loadingInfluencers[influencer?.details?.id]
                                    ? undefined
                                    : () =>
                                        unfollowUser(influencer?.details?.id)
                                }
                                disabled={
                                  loadingInfluencers[influencer?.details?.id]
                                }
                                loading={
                                  loadingInfluencers[influencer?.details?.id]
                                }
                                icon={<Icon.UserMinus size="16" />}
                                className="w-[104px]"
                              >
                                Unfollow
                              </Button.Medium>
                            ) : (
                              <Button.Medium
                                onClick={
                                  loadingInfluencers[influencer?.details?.id]
                                    ? undefined
                                    : () => followUser(influencer?.details?.id)
                                }
                                disabled={
                                  loadingInfluencers[influencer?.details?.id]
                                }
                                loading={
                                  loadingInfluencers[influencer?.details?.id]
                                }
                                icon={<Icon.UserPlus size="16" />}
                                className="w-[104px]"
                              >
                                Follow
                              </Button.Medium>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
        <Sidebar className="hidden 2xl:block">
          <WhoFollow />
          <Feedback />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
