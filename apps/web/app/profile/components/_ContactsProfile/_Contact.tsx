import { UserView } from '@/types/User';
import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';
import { Button, Icon, PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { usePubkyClientContext } from '@/contexts';
import { useState } from 'react';
import { LoadingContacts } from '@/types';

export default function Contact({
  contacts,
  isLoading,
}: {
  contacts: UserView[] | [] | undefined;
  isLoading: false;
}) {
  const { pubky, createTag, deleteTag, follow, unfollow } =
    usePubkyClientContext();
  const [loadingContacts, setLoadingContacts] = useState<LoadingContacts>({});
  const [followed, setFollowed] = useState<{ [pubky: string]: boolean }>({});

  const handleAddProfileTag = async (creatorPubky: string, tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await createTag(pubKeyToUse, tag);
    }
  };

  const handleDeleteProfileTag = async (creatorPubky: string, tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await deleteTag(pubKeyToUse, tag);
    }
  };

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;
      setLoadingContacts((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));
      setLoadingContacts((prevLoadingUsers) => ({
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
      setLoadingContacts((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true,
      }));

      const result = await unfollow(pubkyUnfollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));
      setLoadingContacts((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  {
    /** 
  const [initLoadingContacts, setInitLoadingContacts] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState<LoadingContacts>({});
  const [profiles, setProfiles] = useState<{ [key: string]: IUserProfile }>({});
  const [followed, setFollowed] = useState<{ [pubky: string]: boolean }>({});

  useEffect(() => {
    async function fetchData() {
      try {
        if (!pubky) return;
        const following = await listFollowing(pubky);
        if (following && contacts) {
          following.following.forEach((user) => {
            const uri = user.uri.replace('pubky:', '');
            if (
              contacts.some(
                (contact) => contact.uri.replace('pubky:', '') === uri
              )
            ) {
              setFollowed((prevState) => ({
                ...prevState,
                [uri]: true,
              }));
            }
          });
        }
        setInitLoadingContacts(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, listFollowing, contacts]);

  useEffect(() => {
    async function fetchProfiles() {
      if (contacts && contacts.length > 0) {
        const profilePromises = contacts.map(async (contact) => {
          const contactId = contact.uri.replace('pubky:', '');
          const userProfile = await fetchProfile(contactId);
          return { contactId, userProfile };
        });

        const profilesArray = await Promise.all(profilePromises);
        const profilesMap: { [key: string]: IUserProfile } =
          profilesArray.reduce((acc, { contactId, userProfile }) => {
            if (userProfile) {
              acc[contactId] = userProfile;
            }
            return acc;
          }, {} as { [key: string]: IUserProfile });

        setProfiles(profilesMap);
      }
    }

    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts]);

  async function fetchProfile(pubky: string): Promise<IUserProfile | null> {
    const userProfile = await getUserIndexed(pubky);
    return userProfile;
  }

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;
      setLoadingContacts((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));
      setLoadingContacts((prevLoadingUsers) => ({
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
      setLoadingContacts((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true,
      }));

      const result = await unfollow(pubkyUnfollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));
      setLoadingContacts((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  */
  }

  return (
    <>
      {contacts &&
        contacts.map((contact) => {
          const pubkeyUser = pubky && contact?.details?.id.includes(pubky);
          const isFollowed =
            followed[contact?.details?.id] ||
            contact?.relationship?.following ||
            false;

          return (
            <div key={contact?.details?.id} className="w-full">
              <div className="w-full">
                <div className="flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
                  <Link
                    className="flex gap-2 w-full"
                    href={`/profile/${contact?.details?.id}`}
                  >
                    <ImageByUri
                      width={48}
                      height={48}
                      uri={contact?.details?.image || '/images/Userpic.png'}
                      alt={`profile-pic-${contact?.details?.id}`}
                      className="rounded-full w-[48px] h-[48px] max-w-none"
                    />
                    <div className="flex-col justify-center items-start inline-flex">
                      <Typography.Body variant="medium-bold">
                        {contact?.details.name &&
                          Utils.minifyText(contact?.details?.name, 8)}
                      </Typography.Body>
                      <Typography.Label className="text-opacity-30 -mt-1">
                        {contact?.details?.id &&
                          Utils.minifyPubky(contact?.details?.id)}
                      </Typography.Label>
                    </div>
                  </Link>
                  <div className="lg:flex justify-end gap-2 items-center lg:w-full">
                    {contact?.tags?.slice(0, 3).map((tag, index) => {
                      const isTagFound = tag?.tagged?.some(
                        (fromItem) => fromItem?.tagger_id === pubky
                      );

                      return (
                        <PostUtil.Tag
                          key={index}
                          clicked={false}
                          onClick={(event) => {
                            event.stopPropagation();
                            isTagFound
                              ? handleDeleteProfileTag(
                                  contact?.details?.id,
                                  tag?.label
                                )
                              : handleAddProfileTag(
                                  contact?.details?.id,
                                  tag?.label
                                );
                          }}
                          color={
                            tag?.label && Utils.generateRandomColor(tag?.label)
                          }
                        >
                          <div className="flex gap-2 items-center">
                            {Utils.minifyText(tag?.label.replace(' ', ''), 10)}
                            <Typography.Caption
                              variant="bold"
                              className="text-opacity-30"
                            >
                              {tag?.tagged?.length}
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
                      {contact?.counts?.tags ?? 0}
                    </Typography.Body>
                  </div>
                  <div className="flex-col justify-start items-start gap-1 inline-flex">
                    <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
                      Posts
                    </Typography.Label>
                    <Typography.Body variant="medium-bold">
                      {contact?.counts?.posts ?? 0}
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
                          loadingContacts[contact?.details?.id]
                            ? undefined
                            : () => unfollowUser(contact?.details?.id)
                        }
                        disabled={loadingContacts[contact?.details?.id]}
                        loading={loadingContacts[contact?.details?.id]}
                        icon={<Icon.UserMinus size="16" />}
                        className="w-[104px]"
                      >
                        Unfollow
                      </Button.Medium>
                    ) : (
                      <Button.Medium
                        onClick={
                          loadingContacts[contact?.details?.id]
                            ? undefined
                            : () => followUser(contact?.details?.id)
                        }
                        disabled={loadingContacts[contact?.details?.id]}
                        loading={loadingContacts[contact?.details?.id]}
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
  );
}
