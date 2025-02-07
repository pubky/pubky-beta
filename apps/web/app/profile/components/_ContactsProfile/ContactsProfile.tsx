'use client';

import { useEffect, useState, Suspense } from 'react';
import { Icon } from '@social/ui-shared';
import Skeletons from '@/components/Skeletons';
import { TContacts } from '@/types';
import Root from './_Root';
import Contact from './_Contact';
import { usePubkyClientContext } from '@/contexts';
import { useStreamUsers } from '@/hooks/useStream';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { UserView } from '@/types/User';
import { ContentNotFound } from '@/components';
import Image from 'next/image';

type ContactsContentProps = {
  contacts: TContacts;
  creatorPubky?: string;
};

const caseNotFoundMessages = {
  followers: {
    icon: <Icon.UsersLeft size="48" color="#C8FF00" />,
    title: 'Looking for followers?',
    description:
      'When someone follows this account, their profile will appear here. Start posting and engaging with others to grow your followers!',
  },
  following: {
    icon: <Icon.UsersRight size="48" color="#C8FF00" />,
    title: 'Looking for following?',
    description:
      'Following accounts is a simple way to curate your timeline and stay updated on the topics and people that interest you.',
  },
  friends: {
    icon: <Icon.Smiley size="48" color="#C8FF00" />,
    title: 'Looking for friends?',
    description:
      'When you and another user follow each other, their profile will appear here. Start posting and engaging with others to grow your friends!',
  },
  default: {
    icon: <Icon.User size="48" color="#C8FF00" />,
    title: 'Looking for friends?',
    description: 'No contacts to show.',
  },
};

const ContactsContent = ({ contacts, creatorPubky }: ContactsContentProps) => {
  const { pubky } = usePubkyClientContext();
  const currentContact =
    caseNotFoundMessages[contacts] || caseNotFoundMessages.default;
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
        <ContentNotFound
          icon={currentContact.icon}
          title={currentContact.title}
          description={currentContact.description}
        >
          <div className="absolute top-0 z-0">
            <Image
              alt="not-found-contacts"
              width={400}
              height={485}
              src="/images/webp/not-found/contacts.webp"
            />
          </div>
        </ContentNotFound>
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
