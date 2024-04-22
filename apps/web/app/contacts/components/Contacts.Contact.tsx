'use client';

import { useEffect, useState } from 'react';
import { Contacts } from '.';
import { IFollower, LoadingContacts, ICount } from '../../../types';
import { useClientContext } from '../../../contexts/client';
import { useFilterContext } from '../../../contexts/filters';

export default function Contact({ contacts }: { contacts: IFollower[] }) {
  const { pubky, follow, unfollow, listFollowing, countContacts } =
    useClientContext();
  const { contactsLayout } = useFilterContext();
  const [initLoadingContacts, setInitLoadingContacts] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState<LoadingContacts>({});
  const [followed, setFollowed] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [contactsCount, setContactsCount] = useState<ICount | undefined>();

  useEffect(() => {
    async function fetchData() {
      try {
        if (!pubky) return;
        const following = await listFollowing(pubky);
        if (following && contacts) {
          const count = await fetchCount();
          setContactsCount(count);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky, listFollowing, contacts]);

  const fetchCount = async () => {
    const counts: ICount = {};
    if (!contacts || contacts.length === 0) return counts;

    for (const contact of contacts) {
      const contactId = contact.uri.replace('pubky:', '');
      counts[contactId] = await countContacts(contactId);
    }
    return counts;
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

  return (
    <>
      {contacts &&
        contacts.map((contact, index) => {
          const pubkeyUser = pubky && contact.uri.includes(pubky);
          const contactId = contact.uri.replace('pubky:', '');
          const isFollowed = followed[contactId] || false;
          const count = contactsCount && contactsCount[contactId];

          return (
            <>
              {contactsLayout === 'ranking' ? (
                <Contacts.Ranking
                  index={index}
                  contactId={contactId}
                  contact={contact}
                  countFollowers={count?.followers}
                  countFollowing={count?.following}
                  contactsLength={contacts.length}
                  initLoadingContacts={initLoadingContacts}
                  isFollowed={isFollowed}
                  loadingContacts={loadingContacts}
                  followUser={followUser}
                  unfollowUser={unfollowUser}
                />
              ) : (
                <Contacts.List
                  index={index}
                  contactId={contactId}
                  contact={contact}
                  countFollowers={count?.followers}
                  countFollowing={count?.following}
                  pubkeyUser={pubkeyUser}
                  contactsLength={contacts.length}
                  initLoadingContacts={initLoadingContacts}
                  isFollowed={isFollowed}
                  loadingContacts={loadingContacts}
                  followUser={followUser}
                  unfollowUser={unfollowUser}
                />
              )}
            </>
          );
        })}
    </>
  );
}
