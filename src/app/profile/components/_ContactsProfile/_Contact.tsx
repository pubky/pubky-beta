import { UserView } from '@/types/User';
import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';
import { Button, Icon, PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { LoadingContacts } from '@/types';

export default function Contact({
  contacts,
  isLoading
}: {
  contacts: UserView[] | [] | undefined;
  isLoading: boolean;
}) {
  const { pubky, createTagProfile, deleteTagProfile, follow, unfollow } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [loadingContacts, setLoadingContacts] = useState<LoadingContacts>({});
  const [followed, setFollowed] = useState<{ [pubky: string]: boolean }>({});
  const [profileTags, setProfileTags] = useState<{
    [pubky: string]: UserView['tags'];
  }>({});
  const [loadingTags, setLoadingTags] = useState('');

  useEffect(() => {
    if (contacts) {
      const initialFollowedState = contacts.reduce(
        (acc, profile) => {
          acc[profile.details.id] = profile.relationship?.following || false;
          return acc;
        },
        {} as { [pubky: string]: boolean }
      );
      setFollowed(initialFollowedState);

      const initialTagsState = contacts.reduce(
        (acc, profile) => {
          acc[profile.details.id] = profile.tags || [];
          return acc;
        },
        {} as { [pubky: string]: UserView['tags'] }
      );
      setProfileTags(initialTagsState);
    }
  }, [contacts]);

  const handleAddProfileTag = async (creatorPubky: string, tag: string) => {
    // loading tag
    setLoadingTags(tag);
    const pubKeyToUse = (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      const currentTags = profileTags[creatorPubky] || [];
      const tagExists = currentTags.find((t) => t.label === tag);

      if (tagExists) {
        setLoadingTags('');
        tagExists.taggers_count++;
        tagExists.taggers.push(pubky || '');
        tagExists.relationship = true;
        setProfileTags((prev) => ({
          ...prev,
          [creatorPubky]: [...currentTags]
        }));
      } else {
        setProfileTags((prev) => ({
          ...prev,
          [creatorPubky]: [
            ...currentTags,
            {
              label: tag,
              taggers: [pubky || ''],
              taggers_count: 1,
              relationship: true
            }
          ]
        }));
      }

      const response = await createTagProfile(pubKeyToUse, tag);
      if (!response) {
        console.error('Error adding tag');
      }
      setLoadingTags('');
    }
  };

  const handleDeleteProfileTag = async (creatorPubky: string, tag: string) => {
    // loading tag
    setLoadingTags(tag);
    const pubKeyToUse = (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      const currentTags = profileTags[creatorPubky] || [];
      const tagExists = currentTags.find((t) => t.label === tag);

      if (tagExists) {
        setLoadingTags('');
        tagExists.taggers_count--;
        tagExists.taggers = tagExists.taggers.filter((tagger) => tagger !== pubky);

        setProfileTags((prev) => ({
          ...prev,
          [creatorPubky]:
            tagExists.taggers_count > 0
              ? currentTags.map((t) => (t.label === tag ? { ...t, relationship: false } : t))
              : currentTags.filter((t) => t.label !== tag)
        }));
      }

      const response = await deleteTagProfile(pubKeyToUse, tag);
      if (!response) {
        console.error('Error deleting tag');
      }
      setLoadingTags('');
    }
  };

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;
      setLoadingContacts((prev) => ({
        ...prev,
        [pubkyFollow]: true
      }));

      const result = await follow(pubkyFollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowed((prevState) => ({
        ...prevState,
        [pubkyFollow]: result
      }));
      setLoadingContacts((prev) => ({
        ...prev,
        [pubkyFollow]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (pubkyUnfollow: string) => {
    try {
      if (!pubkyUnfollow) return;
      setLoadingContacts((prev) => ({
        ...prev,
        [pubkyUnfollow]: true
      }));

      const result = await unfollow(pubkyUnfollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowed((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result
      }));
      setLoadingContacts((prev) => ({
        ...prev,
        [pubkyUnfollow]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {contacts &&
        contacts.map((contact) => {
          const pubkeyUser = pubky && contact?.details?.id.includes(pubky);
          const isFollowed = followed[contact?.details?.id];
          const contactTags = profileTags[contact.details.id] || [];

          return (
            <div key={contact?.details?.id} className="w-full">
              <div className="w-full">
                <div className="p-6 rounded-2xl bg-white bg-opacity-10 lg:p-0 lg:bg-transparent flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
                  <div className="w-full flex justify-between items-center">
                    <Link className="flex gap-2 w-full" href={`/profile/${contact?.details?.id}`}>
                      <ImageByUri
                        width={48}
                        height={48}
                        uri={contact?.details?.image || '/images/webp/Userpic.webp'}
                        alt={`profile-pic-${contact?.details?.id}`}
                        className="rounded-full w-[48px] h-[48px] max-w-none"
                      />
                      <div className="flex-col justify-center items-start inline-flex">
                        <Typography.Body id="list-profile-name" variant="medium-bold">
                          {contact?.details.name && Utils.minifyText(contact?.details?.name, 20)}
                        </Typography.Body>
                        <Typography.Label className="text-opacity-30 -mt-1">
                          {contact?.details?.id && Utils.minifyPubky(contact?.details?.id)}
                        </Typography.Label>
                      </div>
                    </Link>

                    <div className="flex lg:hidden gap-4">
                      <div className="inline-flex flex-col justify-start items-start gap-1">
                        <Typography.Label className="text-[12px] text-opacity-30 -mb-1">Tags</Typography.Label>
                        <Typography.Body variant="medium-bold">{contact?.counts?.tags ?? 0}</Typography.Body>
                      </div>
                      <div className="inline-flex flex-col justify-start items-start gap-1">
                        <Typography.Label className="text-[12px] text-opacity-30 -mb-1">Posts</Typography.Label>
                        <Typography.Body variant="medium-bold">{contact?.counts?.posts ?? 0}</Typography.Body>
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:justify-end gap-2 items-center lg:w-full">
                    {contactTags.slice(0, 3).map((tag, index) => {
                      const isTagFound = tag?.relationship || false;

                      return (
                        <PostUtil.Tag
                          key={index}
                          clicked={isTagFound}
                          onClick={(event) => {
                            event.stopPropagation();
                            isTagFound
                              ? handleDeleteProfileTag(contact?.details?.id, tag?.label)
                              : handleAddProfileTag(contact?.details?.id, tag?.label);
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
                      );
                    })}
                  </div>
                  <div className="hidden lg:inline-flex flex-col justify-start items-start gap-1 inline-flex">
                    <Typography.Label className="text-[12px] text-opacity-30 -mb-1">Tags</Typography.Label>
                    <Typography.Body id="list-tags-counter" variant="medium-bold">
                      {contact?.counts?.tags ?? 0}
                    </Typography.Body>
                  </div>
                  <div className="hidden lg:inline-flex flex-col justify-start items-start gap-1 inline-flex">
                    <Typography.Label className="text-[12px] text-opacity-30 -mb-1">Posts</Typography.Label>
                    <Typography.Body id="list-posts-counter" variant="medium-bold">
                      {contact?.counts?.posts ?? 0}
                    </Typography.Body>
                  </div>
                  <div className="flex gap-4">
                    {pubkeyUser ? (
                      <Button.Medium
                        id="list-me-label"
                        className="w-full lg:w-[104px] bg-transparent cursor-default"
                        icon={<Icon.User size="16" />}
                      >
                        Me
                      </Button.Medium>
                    ) : isLoading ? (
                      <Button.Medium disabled loading={isLoading}>
                        Loading
                      </Button.Medium>
                    ) : isFollowed ? (
                      <Button.Medium
                        id="list-unfollow-button"
                        onClick={
                          loadingContacts[contact?.details?.id] ? undefined : () => unfollowUser(contact?.details?.id)
                        }
                        disabled={loadingContacts[contact?.details?.id]}
                        loading={loadingContacts[contact?.details?.id]}
                        icon={<Icon.UserMinus size="16" />}
                        className="w-full lg:w-[104px]"
                      >
                        Unfollow
                      </Button.Medium>
                    ) : (
                      <Button.Medium
                        id="list-follow-button"
                        onClick={
                          loadingContacts[contact?.details?.id] ? undefined : () => followUser(contact?.details?.id)
                        }
                        disabled={loadingContacts[contact?.details?.id]}
                        loading={loadingContacts[contact?.details?.id]}
                        icon={<Icon.UserPlus size="16" />}
                        className="w-full lg:w-[104px]"
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
  );
}
