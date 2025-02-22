import { Skeleton } from '@/components';
import { useModal, usePubkyClientContext } from '@/contexts';
import { UserTags, UserView } from '@/types/User';
import {
  Button,
  Icon,
  PostUtil,
  SideCard,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import { useEffect } from 'react';

interface TaggedSectionProps {
  profileTags: UserTags[];
  loadingProfileTags: boolean;
  handleAddProfileTag: (tag: string) => void;
  handleDeleteProfileTag: (tag: string) => void;
  creatorPubky: string | null | undefined;
  name: string;
  loadingTags: string;
  userPubky: string;
  user: UserView | null;
}

export default function TaggedSection({
  profileTags,
  loadingProfileTags,
  handleAddProfileTag,
  handleDeleteProfileTag,
  creatorPubky,
  name,
  loadingTags,
  userPubky,
  user,
}: TaggedSectionProps) {
  const { pubky } = usePubkyClientContext();
  const { openModal, isOpen } = useModal();

  const handleOpenModal = () => {
    openModal('profileTags', {
      profileTags: profileTags,
      handleAddProfileTag: handleAddProfileTag,
      handleDeleteProfileTag: handleDeleteProfileTag,
      pubkyUser: userPubky,
      user: user,
    });
  };

  // Update post in Modal when profileTags changes
  useEffect(() => {
    if (isOpen('profileTags')) {
      handleOpenModal();
    }
  }, [profileTags]);

  return (
    <div className="w-full">
      <SideCard.Header title="Tagged as" />
      {loadingProfileTags ? (
        <Skeleton.Simple />
      ) : (
        <div className="mt-4 justify-start items-start gap-2 flex flex-col">
          {profileTags.length > 0 ? (
            <>
              {profileTags.map((tag, index) => {
                const isTagFound = tag?.relationship || false;

                return (
                  <div className="flex gap-2" key={index}>
                    <PostUtil.Tag
                      key={index}
                      clicked={isTagFound}
                      onClick={(event) => {
                        event.stopPropagation();
                        pubky
                          ? isTagFound
                            ? handleDeleteProfileTag(tag?.label)
                            : handleAddProfileTag(tag?.label)
                          : openModal('join');
                      }}
                      color={
                        tag?.label && Utils.generateRandomColor(tag?.label)
                      }
                    >
                      <div className="flex gap-2 items-center">
                        {Utils.minifyText(tag?.label, 20)}
                      </div>
                    </PostUtil.Tag>
                    {/**</TooltipUI.Root>*/}
                    <Link href={pubky ? `/search?tags=${tag?.label}` : ''}>
                      <Button.Action
                        variant="custom"
                        size="small"
                        icon={<Icon.MagnifyingGlassLeft size="14" />}
                        className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                      />
                    </Link>
                    <PostUtil.Counter className="w-full">
                      {loadingTags === tag?.label ? (
                        <Icon.LoadingSpin size="12" />
                      ) : (
                        tag?.taggers_count
                      )}
                    </PostUtil.Counter>
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
            id="profile-tag-btn"
            className="mt-2 w-auto h-8 inline-flex items-center"
            onClick={() => (pubky ? handleOpenModal() : openModal('join'))}
            icon={<Icon.Tag size="16" />}
          >
            Tag{' '}
            {!creatorPubky || creatorPubky === pubky
              ? 'yourself'
              : Utils.minifyText(name, 9)}
          </Button.Medium>
        </div>
      )}
    </div>
  );
}
