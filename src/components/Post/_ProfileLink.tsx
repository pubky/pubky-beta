'use client';

import { usePubkyClientContext } from '@/contexts';
import { getUserProfile } from '@/services/userService';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

function ProfileLink({ pk }: { pk: string }) {
  const { pubky } = usePubkyClientContext();
  const [pkFound, setPkFound] = useState<string>('');
  const [userName, setUserName] = useState<string | null>(null);

  const pkMatch = pk.match(/pk:[a-zA-Z0-9]{52}/);
  const pkPart = pk.replace('pk:', '').trim();
  const remainingPart = pk.replace(pkMatch?.[0] || '', '').trim();

  useEffect(() => {
    const fetchUser = async () => {
      if (pkMatch) {
        const pkFound = pkMatch[0];
        setPkFound(pkFound);
        const result = await getUserProfile(pkFound.replace('pk:', '').trim(), pubky ?? '');
        if (result) setUserName(result?.details?.name);
      }
    };
    fetchUser();
  }, [pk]);

  return (
    <>
      <Link
        className="text-[#C8FF00] break-words"
        href={`/profile/${pkPart}`}
        onClick={(event) => event.stopPropagation()}
      >
        {userName ? `@${userName}` : Utils.minifyPubky(pkFound.replace('pk:', ''))}
      </Link>
      {remainingPart}
    </>
  );
}

export default ProfileLink;
