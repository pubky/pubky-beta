'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';
import { Button, Icon, PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useUserProfile } from '@/hooks/useUser';
import { UserView } from '@/types/User';
import { usePubkyClientContext } from '@/contexts';

export default function Contact({
  contacts,
  isLoading,
}: {
  contacts: string[] | [] | undefined;
  isLoading: false;
}) {
  const [profiles, setProfiles] = useState<(UserView | null)[]>([]);
  const { pubky } = usePubkyClientContext();

  useEffect(() => {
    async function fetchProfiles() {
      if (contacts && contacts.length > 0) {
        const profilePromises = contacts.map(async (contact) => {
          const { data } = useUserProfile(contact);
          return data;
        });

        const profilesArray = await Promise.all(profilePromises);
        setProfiles(profilesArray);
      }
    }

    fetchProfiles();
  }, [contacts]);

  console.log('profiles', profiles);
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
      {profiles &&
        profiles.map((profile, index) => {
          const pubkeyUser = pubky && profile?.details?.id.includes(pubky);
          const contactId = profile?.details?.id.replace('pubky:', '');
          //const isFollowed = followed[contactId] || false;
          //const profile = profiles[contactId];

          return (
            <div key={`profile-${index}`} className="w-full">
              <div className="w-full">
                <div className="flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
                  <Link
                    className="flex gap-2 w-full"
                    href={`/profile/${contactId}`}
                  >
                    <ImageByUri
                      width={48}
                      height={48}
                      uri={profile?.details?.image || '/images/Userpic.png'}
                      alt={`profile-pic-${index + 1}`}
                      className="rounded-full w-[48px] h-[48px] max-w-none"
                    />
                    <div className="flex-col justify-center items-start inline-flex">
                      <Typography.Body variant="medium-bold">
                        {profile?.details.name &&
                          Utils.minifyText(profile?.details?.name, 8)}
                      </Typography.Body>
                      <Typography.Label className="text-opacity-30 -mt-1">
                        {profile?.details?.id &&
                          Utils.minifyPubky(profile?.details?.id)}
                      </Typography.Label>
                    </div>
                  </Link>
                  <div className="lg:flex justify-end gap-2 items-center lg:w-full">
                    {profile?.tags?.map((tag, index) => {
                      //const isTagFound = tag.from.some(
                      // (fromItem) => fromItem === pubky
                      // );

                      return (
                        <PostUtil.Tag
                          key={index}
                          clicked={false}
                          //onClick={(event) => {
                          //  event.stopPropagation();
                          //  isTagFound
                          //</div>    ? handleDeleteProfileTag(tag.tag)
                          //    : handleAddProfileTag(tag.tag);
                          //}}
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
                      {profile?.counts?.tags ?? 0}
                    </Typography.Body>
                  </div>
                  <div className="flex-col justify-start items-start gap-1 inline-flex">
                    <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
                      Posts
                    </Typography.Label>
                    <Typography.Body variant="medium-bold">
                      {profile?.counts?.posts ?? 0}
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
                    ) : profile?.relationship?.followed_by ? (
                      <Button.Medium
                        //onClick={
                        //  loadingContacts[contactId]
                        //   ? undefined
                        //   : () => unfollowUser(contactId)
                        //}
                        //disabled={loadingContacts[contactId]}
                        //loading={loadingContacts[contactId]}
                        icon={<Icon.UserMinus size="16" />}
                        className="w-[104px]"
                      >
                        Unfollow
                      </Button.Medium>
                    ) : (
                      <Button.Medium
                        //onClick={
                        //  loadingContacts[contactId]
                        //   ? undefined
                        //   : () => followUser(contactId)
                        //}
                        //disabled={loadingContacts[contactId]}
                        //loading={loadingContacts[contactId]}
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
