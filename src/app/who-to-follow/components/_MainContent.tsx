'use client';

import { useEffect, useState, Suspense } from 'react';
import { Typography } from '@social/ui-shared';
import Skeletons from '@/components/Skeletons';
import { usePubkyClientContext } from '@/contexts';
import { useStreamUsers } from '@/hooks/useStream';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { UserView } from '@/types/User';
import Root from '@/app/profile/components/_ContactsProfile/_Root';
import Contact from '@/app/profile/components/_ContactsProfile/_Contact';

const ContactsContent = () => {
  const { pubky } = usePubkyClientContext();
  const limit = 30;
  const [usersList, setUsersList] = useState<UserView[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { data: contactUsers, isLoading } = useStreamUsers(pubky ?? '', pubky ?? '', 'recommended', skip, limit);

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
  }, [pubky]);

  return (
    <div className="w-full">
      {isLoading && usersList.length === 0 ? (
        <div className="mt-12">
          <Skeletons.Simple />
        </div>
      ) : usersList.length > 0 ? (
        <Root>
          <Contact contacts={usersList} isLoading={isLoading} />
        </Root>
      ) : (
        <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
          <Typography.H2 className="font-normal text-opacity-30">No users to follow</Typography.H2>
        </div>
      )}
      {hasMore && <div ref={loader} />}
    </div>
  );
};

export default function MainContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactsContent />
    </Suspense>
  );
}
