'use client';

import { useEffect, useState, Suspense } from 'react';
import { Typography } from '@social/ui-shared';
import Skeletons from '@/components/Skeletons';
import { TContacts } from '@/types';
import Root from './_Root';
import Contact from './_Contact';
import { usePubkyClientContext } from '@/contexts';
import { useStreamUsers } from '@/hooks/useStream';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { UserView } from '@/types/User';

type ContactsContentProps = {
  contacts: TContacts;
  creatorPubky?: string;
};

const ContactsContent = ({ contacts, creatorPubky }: ContactsContentProps) => {
  const { pubky } = usePubkyClientContext();
  const limit = 10;
  const [usersList, setUsersList] = useState<UserView[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const usePubky = creatorPubky ?? pubky;

  const { data: contactUsers, isLoading } = useStreamUsers(
    usePubky ?? '',
    pubky ?? '',
    contacts,
    skip,
    limit,
  );

  const fetchUsers = () => {
    if (isLoading || !hasMore) return;

    if (contactUsers && Array.isArray(contactUsers)) {
      setUsersList((prev) => {
        const newUsers = contactUsers.filter(
          (user) => !prev.some((u) => u.details.id === user.details.id),
        );
        setHasMore(newUsers.length >= limit);
        return [...prev, ...newUsers];
      });
      setSkip((prev) => prev + limit);
    }
  };

  const loader = useInfiniteScroll(fetchUsers, isLoading);

  useEffect(() => {
    setUsersList([]);
    setSkip(0);
    setHasMore(true);
  }, [contacts, creatorPubky]);

  return (
    <>
      {isLoading && usersList.length === 0 ? (
        <div className="mt-12">
          <Skeletons.Simple />
        </div>
      ) : usersList.length > 0 ? (
        <Root>
          <Contact contacts={usersList} isLoading={isLoading} />
        </Root>
      ) : (
        <Typography.H2 className="mt-[100px] font-normal text-opacity-50 text-center">
          {contacts === 'followers' && 'No followers yet'}
          {contacts === 'following' && 'No following yet'}
          {contacts === 'friends' && 'No friends yet'}
          {contacts !== 'followers' &&
            contacts !== 'following' &&
            contacts !== 'friends' &&
            'No contacts yet'}
        </Typography.H2>
      )}
      {hasMore && <div ref={loader} />}
    </>
  );
};

export default function ContactsProfile({
  contacts,
  creatorPubky,
}: ContactsContentProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactsContent contacts={contacts} creatorPubky={creatorPubky} />
    </Suspense>
  );
}
