'use client';

import { BottomSheet, ContentNotFound, Skeleton } from '@/components';
import { useUserProfile } from '@/hooks/useUser';
import { useAlertContext, useJoin, usePubkyClientContext } from '@/contexts';
import { UserTags } from '@/types/User';
import {
  Button,
  Icon,
  PostUtil,
  SideCard,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '@/components/ImageByUri';
import Modal from '@/components/Modal';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/services/userService';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/useIsMobile';
import LinksSection from './Sidebar/_LinksSection';
import { useTagsUser } from '@/hooks/useTag';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import Image from 'next/image';

type TaggedAsProps = {
  creatorPubky?: string | undefined;
  loading?: boolean;
};

export default function TaggedAs({ creatorPubky, loading }: TaggedAsProps) {
  const { openJoin } = useJoin();
  const { addAlert } = useAlertContext();
  const { pubky, createTagProfile, deleteTagProfile } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const usePubky = creatorPubky || pubky || '';
  const { data: user } = useUserProfile(usePubky, pubky ?? '');
  const name = user?.details?.name;
  const [profileTags, setProfileTags] = useState<UserTags[]>(user?.tags ?? []);
  const links = user?.details?.links ?? [];
  const [showModalProfileTag, setShowModalProfileTag] = useState(false);
  const [showSheetProfileTag, setShowSheetProfileTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<UserTags | null>(null);
  const [showModalCheckLink, setShowModalCheckLink] = useState(false);
  const [showSheetCheckLink, setShowSheetCheckLink] = useState(false);
  const [clickedLink, setClickedLink] = useState('');
  const checkLink = Utils.storage.get('checkLink') as boolean;
  const [taggedImages, setTaggedImages] = useState<(string | undefined)[][]>(
    [],
  );
  const [loadingTags, setLoadingTags] = useState('');
  const limit = 20;
  const [skip, setSkip] = useState(limit);
  const [hasMore, setHasMore] = useState(user && user?.counts?.tags > limit);

  const { data: moreTags, isLoading } = useTagsUser(
    user?.details.id ?? '',
    pubky,
    skip,
    limit,
  );

  useEffect(() => {
    if (!isLoading && moreTags && moreTags.length) {
      setProfileTags((prev) => {
        const newTags = moreTags.filter(
          (tag) => !prev.some((t) => t.label === tag.label),
        );
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
              }) ?? [],
            );
            return images;
          }),
        );
        setTaggedImages(allImages);
      }
    };

    fetchTaggedImages();
  }, [profileTags, pubky]);

  const handleAddProfileTag = async (tag: string) => {
    // loading tag
    setLoadingTags(tag);
    if (usePubky) {
      // before adding tag, check if tag already exists and is not the same pubky
      const tagExists = profileTags.find((t) => t.label === tag);

      if (tagExists) {
        // check if tag is the same pubky
        if (tagExists.taggers.includes(pubky || '')) {
          setLoadingTags('');
        } else {
          // add tag to taggers
          tagExists.taggers_count++;

          // update profileTags with new taggers
          const newProfileTags = profileTags.map((t) => {
            if (t.label === tag) {
              return {
                ...t,
                taggers: [...t.taggers, pubky || ''],
                relationship: true,
              };
            }
            return t;
          });

          // update tag in UI
          setProfileTags(newProfileTags);
        }
      } else {
        // update tag optimistic in the UI
        setProfileTags([
          ...profileTags,
          {
            label: tag,
            taggers: [pubky || ''],
            taggers_count: 1,
            relationship: true,
          },
        ]);
      }
      const response = await createTagProfile(usePubky, tag);
      if (!response) {
        // show error message
        addAlert('Error adding tag', 'warning');
      }
      setLoadingTags('');
    }
  };

  const handleDeleteProfileTag = async (tag: string) => {
    // loading tag
    setLoadingTags(tag);

    if (usePubky) {
      // check if tag exists in profileTags
      const tagExists = profileTags.find((t) => t.label === tag);

      if (tagExists) {
        // check if usePubky is in taggers
        if (tagExists.taggers.includes(pubky || '')) {
          // remove tagger from tag but keep the tag but update the taggers_count
          if (tagExists.taggers_count >= 1) {
            tagExists.taggers_count--;
          }
          tagExists.taggers = tagExists.taggers.filter(
            (t) => t !== pubky || '',
          );
          setProfileTags(
            profileTags.map((t) =>
              t.label === tag ? { ...tagExists, relationship: false } : t,
            ),
          );
        } else {
          // remove tag from taggers
          if (tagExists.taggers_count >= 1) {
            tagExists.taggers_count--;
          }
          tagExists.taggers = tagExists.taggers.filter(
            (t) => t !== pubky || '',
          );
          setProfileTags(
            profileTags.map((t) =>
              t.label === tag ? { ...tagExists, relationship: false } : t,
            ),
          );
        }
      }

      const response = await deleteTagProfile(usePubky, tag);
      if (!response) {
        addAlert('Error deleting tag', 'warning');
      }
      setLoadingTags('');
    }
  };

  return (
    <div className="w-full mx-2 lg:mx-0">
      {name && profileTags.length > 0 && (
        <>
          <SideCard.Header
            className="hidden lg:flex"
            title={`${name} was tagged as:`}
          />
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
                  const extraImagesCount =
                    tag.taggers_count - displayedImages?.length;

                  return (
                    <div className="flex gap-2" key={index}>
                      <PostUtil.Tag
                        clicked={isTagFound}
                        onClick={(event) => {
                          event.stopPropagation();
                          pubky
                            ? isTagFound
                              ? handleDeleteProfileTag(tag?.label)
                              : handleAddProfileTag(tag?.label)
                            : openJoin();
                        }}
                        color={
                          tag?.label && Utils.generateRandomColor(tag?.label)
                        }
                      >
                        <div className="flex gap-2 items-center">
                          {Utils.minifyText(tag?.label, 20)}
                          {loadingTags === tag?.label ? (
                            <Icon.LoadingSpin size="12" />
                          ) : (
                            <Typography.Caption
                              variant="bold"
                              className="text-opacity-60"
                            >
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
                      <div
                        onClick={() => {
                          setSelectedTag(tag);
                          isMobile
                            ? setShowSheetProfileTag(true)
                            : setShowModalProfileTag(true);
                        }}
                        className="cursor-pointer flex items-center"
                      >
                        {displayedImages?.map((image, imageIndex) => (
                          <ImageByUri
                            width={32}
                            height={32}
                            key={`${tag?.label}-${imageIndex}`}
                            className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                              imageIndex > 0 && '-ml-2'
                            }`}
                            alt={`tag-${imageIndex + 1}`}
                            uri={image}
                          />
                        ))}
                        {extraImagesCount > 0 && (
                          <PostUtil.Counter className="-ml-2">
                            +{extraImagesCount}
                          </PostUtil.Counter>
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
                title="Discover who tagged you"
                description={
                  <>
                    Find out which posts, photos, or content include tags
                    mentioning you.
                    <br />
                    Stay connected to what others are sharing about you.
                  </>
                }
              >
                <div className="absolute top-12 z-0">
                  <Image
                    alt="not-found-taggedAs"
                    width={461}
                    height={303}
                    src="/images/webp/not-found/taggedAs.webp"
                  />
                </div>
              </ContentNotFound>
            )}
            <Button.Medium
              className={`mt-2 w-auto h-8 inline-flex lg:hidden items-center ${profileTags.length > 0 && 'self-center'}`}
              onClick={() =>
                isMobile
                  ? setShowSheetProfileTag(true)
                  : setShowModalProfileTag(true)
              }
              icon={<Icon.Tag size="16" />}
            >
              Tag{' '}
              {!creatorPubky || creatorPubky === pubky
                ? 'yourself'
                : name && Utils.minifyText(name, 22)}
            </Button.Medium>
          </div>
          <div className="flex lg:hidden mt-6">
            <LinksSection
              links={links}
              checkLink={checkLink}
              setShowModalCheckLink={setShowModalCheckLink}
              setShowSheetCheckLink={setShowSheetCheckLink}
              setClickedLink={setClickedLink}
            />
          </div>
        </>
      )}
      <Modal.ProfileTag
        profileTags={profileTags ?? []}
        showModalProfileTag={showModalProfileTag}
        setShowModalProfileTag={setShowModalProfileTag}
        handleAddProfileTag={handleAddProfileTag}
        handleDeleteProfileTag={handleDeleteProfileTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        pubkyUser={creatorPubky}
        user={user}
      />
      <BottomSheet.TagProfile
        profileTags={profileTags ?? []}
        show={showSheetProfileTag}
        setShow={setShowSheetProfileTag}
        handleAddProfileTag={handleAddProfileTag}
        handleDeleteProfileTag={handleDeleteProfileTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        pubkyUser={creatorPubky}
        user={user}
      />
      <Modal.CheckLink
        showModalCheckLink={showModalCheckLink}
        setShowModalCheckLink={setShowModalCheckLink}
        clickedLink={clickedLink}
      />
      <BottomSheet.CheckLink
        show={showSheetCheckLink}
        setShow={setShowSheetCheckLink}
        clickedLink={clickedLink}
      />
    </div>
  );
}
