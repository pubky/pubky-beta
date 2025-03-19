'use client';

import { useEffect, useState, Suspense } from 'react';
import { Button, Icon } from '@social/ui-shared';
import Skeletons from '@/components/Skeletons';
import { TContacts } from '@/types';
import Root from './_Root';
import Contact from './_Contact';
import { useModal, usePubkyClientContext } from '@/contexts';
import { useStreamUsers } from '@/hooks/useStream';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { UserView } from '@/types/User';
import { ContentNotFound } from '@/components';
import Image from 'next/image';
import Link from 'next/link';

type ContactsContentProps = {
  contacts: TContacts;
  creatorPubky?: string;
};

const getCaseNotFoundMessages = (
  pubky: string | undefined,
  isMyProfile: boolean,
  openModal: (modal: string) => void
) => ({
  followers: {
    icon: <Icon.UsersLeft size="48" color="#C8FF00" />,
    title: isMyProfile ? 'Looking for followers?' : 'No followers yet',
    description: isMyProfile ? (
      <>
        When someone follows this account, their profile will appear here.
        <br />
        Start posting and engaging with others to grow your followers.
      </>
    ) : (
      'There are no followers to show.'
    ),
    content: isMyProfile && (
      <Button.Medium
        onClick={() => (pubky ? openModal('createPost') : openModal('join'))}
        className="z-10 w-auto"
        icon={<Icon.Plus size="24" />}
      >
        Create a Post
      </Button.Medium>
    )
  },
  following: {
    icon: <Icon.UserPlus size="48" color="#C8FF00" />,
    title: isMyProfile ? 'You are the algorithm' : 'No following yet',
    description: isMyProfile ? (
      <>
        Following accounts is a simple way to curate your timeline.
        <br />
        Stay updated on the topics and people that interest you.
      </>
    ) : (
      'There are no following to show.'
    ),
    content: isMyProfile && (
      <div className="flex gap-3 z-10 justify-center flex-wrap">
        <Link href="/who-to-follow">
          <Button.Medium icon={<Icon.UserPlus size="16" />} className="whitespace-nowrap">
            Who to Follow
          </Button.Medium>
        </Link>
        <Link href="/hot#active">
          <Button.Medium icon={<Icon.UserPlus size="16" />} className="whitespace-nowrap">
            Active Users
          </Button.Medium>
        </Link>
      </div>
    )
  },
  friends: {
    icon: <Icon.Smiley size="48" color="#C8FF00" />,
    title: 'No friends yet',
    description: isMyProfile ? (
      <>
        Follow someone, and if they follow you back, you&apos;ll become friends! <br />
        Start following Pubky users, you never know who might follow you back!
      </>
    ) : (
      'There are no friends to show.'
    ),
    content: isMyProfile && (
      <div className="flex gap-3 z-10 justify-center flex-wrap">
        <Link href="/who-to-follow">
          <Button.Medium icon={<Icon.UserPlus size="16" />} className="whitespace-nowrap">
            Who to Follow
          </Button.Medium>
        </Link>
        <Link href="/hot#active">
          <Button.Medium icon={<Icon.UserPlus size="16" />} className="whitespace-nowrap">
            Popular Users
          </Button.Medium>
        </Link>
      </div>
    )
  },
  default: {
    icon: <Icon.User size="48" color="#C8FF00" />,
    title: 'Looking for contacts?',
    description: 'No contacts to show.',
    content: null
  }
});

const ContactsContent = ({ contacts, creatorPubky }: ContactsContentProps) => {
  const { pubky } = usePubkyClientContext();
  const { openModal } = useModal();
  const isMyProfile = !!(pubky === creatorPubky || !creatorPubky);
  const currentContact =
    getCaseNotFoundMessages(pubky, isMyProfile, openModal)[contacts] ||
    getCaseNotFoundMessages(pubky, isMyProfile, openModal).default;
  const limit = 10;
  const [usersList, setUsersList] = useState<UserView[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const usePubky = creatorPubky ?? pubky;

  const { data: contactUsers, isLoading } = useStreamUsers(usePubky ?? '', pubky ?? '', contacts, skip, limit);

  const fetchUsers = () => {
    if (isLoading || !hasMore) return;

    if (contactUsers && Array.isArray(contactUsers)) {
      setUsersList((prev) => {
        const newUsers = contactUsers.filter((user) => !prev.some((u) => u.details.id === user.details.id));
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
      {usersList.length > 0 && (
        <Root>
          <Contact contacts={usersList} isLoading={isLoading} />
        </Root>
      )}
      {isLoading && (
        <div className="mt-12">
          <Skeletons.Simple />
        </div>
      )}
      {hasMore && <div ref={loader} />}
      {!isLoading && usersList.length === 0 && (
        <ContentNotFound
          icon={currentContact.icon}
          title={currentContact.title}
          description={currentContact.description}
        >
          {currentContact.content}
          <div className="absolute top-0 z-0">
            <Image alt="not-found-contacts" width={400} height={485} src="/images/webp/not-found/contacts.webp" />
          </div>
        </ContentNotFound>
      )}
    </>
  );
};

export default function ContactsProfile({ contacts, creatorPubky }: ContactsContentProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactsContent contacts={contacts} creatorPubky={creatorPubky} />
    </Suspense>
  );
}
