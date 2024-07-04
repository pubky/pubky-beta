'use client';

import { useEffect, useState } from 'react';
import { Contacts } from '.';
import { IFollower, IFollowing, IFriend, LoadingContacts } from '@/types';
import { useClientContext, useFilterContext } from '@/contexts';

export default function Contact({
  contacts,
}: {
  contacts: IFollower[] | IFollowing[] | IFriend[] | [];
}) {
  const { pubky, follow, unfollow, listFollowing } = useClientContext();
  const { contactsLayout } = useFilterContext();
  const [initLoadingContacts, setInitLoadingContacts] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState<LoadingContacts>({});
  const [followed, setFollowed] = useState<{
    [pubky: string]: boolean;
  }>({});

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

  return (
    <>
      {contacts &&
        contacts.map((contact, index) => {
          const pubkeyUser = pubky && contact.uri.includes(pubky);
          const contactId = contact.uri.replace('pubky:', '');
          const isFollowed = followed[contactId] || false;

          return (
            <div key={`contact-${index}`} className="w-full">
              {contactsLayout === 'ranking' ? (
                <Contacts.Ranking
                  index={`rank-${contact.uri}`}
                  contactId={contactId}
                  contact={contact as IFollower}
                  showDivider={contacts.length - 1 !== index}
                  initLoadingContacts={initLoadingContacts}
                  isFollowed={isFollowed}
                  loadingContacts={loadingContacts}
                  followUser={followUser}
                  unfollowUser={unfollowUser}
                />
              ) : (
                <Contacts.List
                  index={`list-${contact.uri}`}
                  contactId={contactId}
                  contact={contact as IFollower}
                  showDivider={contacts.length - 1 !== index}
                  pubkeyUser={pubkeyUser}
                  initLoadingContacts={initLoadingContacts}
                  isFollowed={isFollowed}
                  loadingContacts={loadingContacts}
                  followUser={followUser}
                  unfollowUser={unfollowUser}
                />
              )}
            </div>
          );
        })}
    </>
  );
}
