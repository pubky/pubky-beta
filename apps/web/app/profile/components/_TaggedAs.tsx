'use client';

import { BottomSheet, Skeleton } from '@/components';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
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
  const { pubky, createTagProfile, deleteTagProfile } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const usePubky = creatorPubky || pubky;
  const { data } = useUserProfile(usePubky ?? '', pubky ?? '');
  const name = data?.details?.name;
  const image = data?.details?.image;
  const profileTags = data?.tags;
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
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await createTagProfile(pubKeyToUse, tag);
    }
  };

  const handleDeleteProfileTag = async (tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await deleteTagProfile(pubKeyToUse, tag);
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
            {profileTags && profileTags.length > 0 ? (
              <>
                {profileTags.map((tag, index) => {
                  const isTagFound = tag?.taggers?.some(
                    (fromItem) => fromItem === pubky,
                  );

                  const images = taggedImages[index] || [];
                  const displayedImages = images?.slice(0, 15);
                  const extraImagesCount =
                    images?.length - displayedImages?.length;

                  return (
                    <div className="flex gap-2" key={index}>
                      {/**<TooltipUI.Root
                  delay={500}
                  setShowTooltip={setShowTooltipProfile}
                  tagId={tag.tag}
                >
                  {showTooltipProfile === tag.tag && (
                    <Tooltip.Tag
                      setShowModalTags={setShowModalProfileTag}
                      setSelectedTag={setSelectedTag}
                      tags={tag}
                    />
                  )}*/}
                      <PostUtil.Tag
                        key={index}
                        clicked={isTagFound}
                        onClick={(event) => {
                          event.stopPropagation();
                          isTagFound
                            ? handleDeleteProfileTag(tag?.label)
                            : handleAddProfileTag(tag?.label);
                        }}
                        color={
                          tag?.label && Utils.generateRandomColor(tag?.label)
                        }
                      >
                        <div className="flex gap-2 items-center">
                          {Utils.minifyText(tag?.label, 21)}
                          <Typography.Caption
                            variant="bold"
                            className="text-opacity-60"
                          >
                            {tag?.taggers_count}
                          </Typography.Caption>
                        </div>
                      </PostUtil.Tag>
                      {/**</div></TooltipUI.Root>*/}
                      <Link href={`/search?tags=${tag?.label}`}>
                        <Button.Action
                          variant="custom"
                          size="small"
                          icon={<Icon.MagnifyingGlassLeft size="14" />}
                          className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                        />
                      </Link>
                      <div
                        //onClick={() => setShowModalProfileTag(true)}
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
              </>
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
        profileTags={profileTags ?? []}
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
        profileTags={profileTags ?? []}
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
