'use client';

import { ContentNotFound, Skeleton } from '@/components';
import { useUserProfile } from '@/hooks/useUser';
import { useModal, usePubkyClientContext } from '@/contexts';
import { UserTags } from '@/types/User';
import { Button, Icon, PostUtil, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '@/components/ImageByUri';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/services/userService';
import Link from 'next/link';
import LinksSection from './Sidebar/_LinksSection';
import { useTagsUser } from '@/hooks/useTag';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import Image from 'next/image';
import { useUtilsTag } from '@/components/Modal/_TagProfile/components/_Utils';

type TaggedAsProps = {
  creatorPubky?: string | undefined;
  loading?: boolean;
};

export default function TaggedAs({ creatorPubky, loading }: TaggedAsProps) {
  const { openModal, isOpen } = useModal();
  const { pubky } = usePubkyClientContext();
  const isMyProfile = !!(pubky === creatorPubky || !creatorPubky);
  const usePubky = creatorPubky || pubky || '';
  const { data: user } = useUserProfile(usePubky, pubky ?? '');
  const name = user?.details?.name;
  const [profileTags, setProfileTags] = useState<UserTags[]>(user?.tags ?? []);
  const links = user?.details?.links ?? [];
  const [taggedImages, setTaggedImages] = useState<(string | undefined)[][]>([]);
  const limit = 20;
  const [skip, setSkip] = useState(limit);
  const [hasMore, setHasMore] = useState(user && user?.counts?.tags > limit);
  const { addProfileTag, deleteProfileTag, loadingTags } = useUtilsTag({
    profileTags,
    setProfileTags,
    pubkyUser: usePubky,
    user
  });

  const { data: moreTags, isLoading } = useTagsUser(user?.details.id ?? '', pubky, skip, limit);

  useEffect(() => {
    if (!isLoading && moreTags && moreTags.length) {
      setProfileTags((prev) => {
        const newTags = moreTags.filter((tag) => !prev.some((t) => t.label === tag.label));
        setHasMore(newTags.length > 0);
        return [...prev, ...newTags];
      });
    }
  }, [moreTags, isLoading]);

  const loader = useInfiniteScroll(() => {
    if (hasMore && !isLoading) {
      setSkip((prev) => prev + limit);
    }
  }, isLoading);

  useEffect(() => {
    setProfileTags(user?.tags ?? []);
  }, [user?.tags]);

  useEffect(() => {
    const fetchTaggedImages = async () => {
      if (profileTags && profileTags.length > 0) {
        const allImages = await Promise.all(
          profileTags.map(async (tag) => {
            const images = await Promise.all(
              tag?.taggers?.map(async (fromItem) => {
                const profile = await getUserProfile(fromItem, pubky ?? '');
                return profile?.details?.image;
              }) ?? []
            );
            return images;
          })
        );
        setTaggedImages(allImages);
      }
    };

    fetchTaggedImages();
  }, [profileTags, pubky]);

  const handleOpenModal = () => {
    openModal('profileTags', {
      profileTags: profileTags,
      setProfileTags: setProfileTags,
      pubkyUser: usePubky,
      user: user
    });
  };

  // Update post in Modal when profileTags changes
  useEffect(() => {
    if (isOpen('profileTags')) {
      handleOpenModal();
    }
  }, [profileTags]);

  return (
    <div className="w-full mx-2 lg:mx-0">
      {name && profileTags.length > 0 && (
        <>
          <SideCard.Header className="hidden lg:flex" title={`${name} was tagged as:`} />
          <Typography.Body variant="large-bold" className="flex lg:hidden">
            Tagged
          </Typography.Body>
        </>
      )}
      {loading ? (
        <Skeleton.Simple />
      ) : (
        <>
          <div className="mt-4 justify-start items-start gap-2 flex flex-col">
            {profileTags && profileTags.length > 0 ? (
              <>
                {profileTags.map((tag, index) => {
                  const isTagFound = tag?.relationship || false;

                  const images = taggedImages[index] || [];
                  const displayedImages = images?.slice(0, 5);
                  const extraImagesCount = tag.taggers_count - displayedImages?.length;

                  return (
                    <div className="flex gap-2" key={index}>
                      <PostUtil.Tag
                        clicked={isTagFound}
                        onClick={(event) => {
                          event.stopPropagation();
                          pubky
                            ? isTagFound
                              ? deleteProfileTag(tag?.label)
                              : addProfileTag(tag?.label)
                            : openModal('join');
                        }}
                        color={tag?.label && Utils.generateRandomColor(tag?.label)}
                      >
                        <div className="flex gap-2 items-center">
                          {Utils.minifyText(tag?.label, 20)}
                          {loadingTags === tag?.label ? (
                            <Icon.LoadingSpin size="12" />
                          ) : (
                            <Typography.Caption variant="bold" className="text-opacity-60">
                              {tag.taggers_count}
                            </Typography.Caption>
                          )}
                        </div>
                      </PostUtil.Tag>
                      <Link href={`/search?tags=${tag?.label}`}>
                        <Button.Action
                          variant="custom"
                          size="small"
                          icon={<Icon.MagnifyingGlassLeft size="14" />}
                          className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                        />
                      </Link>
                      <div onClick={handleOpenModal} className="cursor-pointer flex items-center">
                        {displayedImages?.map((image, imageIndex) => (
                          <ImageByUri
                            id={user?.details?.id}
                            width={32}
                            height={32}
                            key={`${tag?.label}-${imageIndex}`}
                            className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                              imageIndex > 0 && '-ml-2'
                            }`}
                            alt={`tag-${imageIndex + 1}`}
                          />
                        ))}
                        {extraImagesCount > 0 && (
                          <PostUtil.Counter className="-ml-2">+{extraImagesCount}</PostUtil.Counter>
                        )}
                      </div>
                    </div>
                  );
                })}
                {hasMore && (
                  <div ref={loader}>
                    <Icon.LoadingSpin />
                  </div>
                )}
              </>
            ) : (
              <ContentNotFound
                icon={<Icon.Tag size="48" color="#C8FF00" />}
                title={isMyProfile ? 'Discover who tagged you' : 'No tags yet'}
                description={
                  isMyProfile ? (
                    <>
                      Find out which posts, photos, or content include tags mentioning you.
                      <br />
                      Stay connected to what others are sharing about you.
                    </>
                  ) : (
                    'There are no tags to show.'
                  )
                }
              >
                <div className="absolute top-12 z-0">
                  <Image alt="not-found-taggedAs" width={461} height={303} src="/images/webp/not-found/taggedAs.webp" />
                </div>
              </ContentNotFound>
            )}
            <Button.Medium
              className={`mt-2 w-auto h-8 inline-flex lg:hidden items-center ${profileTags.length === 0 && 'self-center'}`}
              onClick={handleOpenModal}
              icon={<Icon.Tag size="16" />}
            >
              Tag {!creatorPubky || creatorPubky === pubky ? 'yourself' : name && Utils.minifyText(name, 22)}
            </Button.Medium>
          </div>
          <div className="flex lg:hidden mt-6">
            <LinksSection links={links} />
          </div>
        </>
      )}
    </div>
  );
}
