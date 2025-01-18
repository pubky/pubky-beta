'use client';

import { BottomSheet, Skeleton } from '@/components';
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
  const { data } = useUserProfile(usePubky, pubky ?? '');
  const name = data?.details?.name;
  const image = data?.details?.image;
  const [profileTags, setProfileTags] = useState<UserTags[]>(data?.tags ?? []);
  const links = data?.details?.links ?? [];
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

  useEffect(() => {
    setProfileTags(data?.tags ?? []);
  }, [data?.tags]);

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
    if (usePubky) {
      const tagExists = profileTags.find((t) => t.label === tag);

      if (tagExists) {
        if (!tagExists.taggers.includes(pubky || '')) {
          tagExists.taggers_count++;
          tagExists.taggers.push(pubky || '');
          setProfileTags([...profileTags]);
        }
      } else {
        setProfileTags([
          ...profileTags,
          {
            label: tag,
            taggers: [pubky || ''],
            taggers_count: 1,
          },
        ]);
      }

      const response = await createTagProfile(usePubky, tag);
      if (!response) {
        addAlert('Error adding tag', 'warning');
      }
    }
  };

  const handleDeleteProfileTag = async (tag: string) => {
    if (usePubky) {
      const tagExists = profileTags.find((t) => t.label === tag);

      if (tagExists && tagExists.taggers.includes(pubky || '')) {
        tagExists.taggers_count--;
        tagExists.taggers = tagExists.taggers.filter((t) => t !== pubky);
        setProfileTags(
          tagExists.taggers_count > 0
            ? [...profileTags]
            : profileTags.filter((t) => t.label !== tag),
        );
      }

      const response = await deleteTagProfile(usePubky, tag);
      if (!response) {
        addAlert('Error deleting tag', 'warning');
      }
    }
  };

  return (
    <div className="w-full mx-2 lg:mx-0">
      <SideCard.Header
        className="hidden lg:flex"
        title={`${name} was tagged as:`}
      />
      <Typography.Body variant="large-bold" className="flex lg:hidden">
        Tagged
      </Typography.Body>
      {loading ? (
        <Skeleton.Simple />
      ) : (
        <>
          <div className="mt-4 justify-start items-start gap-2 flex flex-col">
            {profileTags.length > 0 ? (
              profileTags.map((tag, index) => {
                const isTagFound = tag.taggers.includes(pubky || '');
                const images = taggedImages[index] || [];
                const displayedImages = images.slice(0, 15);
                const extraImagesCount = images.length - displayedImages.length;

                return (
                  <div className="flex gap-2" key={index}>
                    <PostUtil.Tag
                      clicked={isTagFound}
                      onClick={(event) => {
                        event.stopPropagation();
                        pubky
                          ? isTagFound
                            ? handleDeleteProfileTag(tag.label)
                            : handleAddProfileTag(tag.label)
                          : openJoin();
                      }}
                      color={Utils.generateRandomColor(tag.label)}
                    >
                      <div className="flex gap-2 items-center">
                        {Utils.minifyText(tag.label, 20)}
                        <Typography.Caption
                          variant="bold"
                          className="text-opacity-60"
                        >
                          {tag.taggers_count}
                        </Typography.Caption>
                      </div>
                    </PostUtil.Tag>
                    <Link href={`/search?tags=${tag.label}`}>
                      <Button.Action
                        variant="custom"
                        size="small"
                        icon={<Icon.MagnifyingGlassLeft size="14" />}
                        className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                      />
                    </Link>
                    <div className="cursor-pointer flex items-center">
                      {displayedImages.map((image, imageIndex) => (
                        <ImageByUri
                          key={imageIndex}
                          uri={image}
                          width={32}
                          height={32}
                          className={`w-[32px] h-[32px] rounded-full shadow ${
                            imageIndex > 0 && '-ml-2'
                          }`}
                          alt={`tag-${imageIndex + 1}`}
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
              })
            ) : (
              <Typography.Body variant="small" className="text-opacity-50">
                No tags yet
              </Typography.Body>
            )}
            <Button.Medium
              className="mt-2 w-auto h-8 inline-flex items-center"
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
        profileTags={profileTags}
        showModalProfileTag={showModalProfileTag}
        setShowModalProfileTag={setShowModalProfileTag}
        handleAddProfileTag={handleAddProfileTag}
        handleDeleteProfileTag={handleDeleteProfileTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        pubkyUser={creatorPubky}
        name={name}
        uriImage={image}
      />
      <BottomSheet.TagProfile
        profileTags={profileTags}
        show={showSheetProfileTag}
        setShow={setShowSheetProfileTag}
        handleAddProfileTag={handleAddProfileTag}
        handleDeleteProfileTag={handleDeleteProfileTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        pubkyUser={creatorPubky}
        name={name}
        uriImage={image}
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
