'use client';

import { usePubkyClientContext } from '@/contexts';
import { getUserProfile } from '@/services/userService';
import { Utils } from '@social/utils-shared';
import React, { useState, useEffect } from 'react';

function ProfileLink({ pk }: { pk: string }) {
  const { pubky } = usePubkyClientContext();
  const [pkFound, setPkFound] = useState<string>('');
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const pkMatch = pk.match(/pk:[a-zA-Z0-9]{52}/);
      if (pkMatch) {
        const pkFound = pkMatch[0];
        setPkFound(pkFound);
        const result = await getUserProfile(
          pkFound.replace('pk:', '').trim(),
          pubky ?? ''
        );
        if (result) setUserName(result?.details?.name);
      }
    };
    fetchUser();
  }, [pk]);

  const pkPart = pk.replace('pk:', '').trim();
  const remainingPart = pk.replace(`pk:${pkPart}`, '');

  return (
    <>
      <a className="text-[#C8FF00] break-all" href={`/profile/${pkPart}`}>
        {userName ? `@${userName}` : Utils.minifyPubky(pkFound)}
      </a>
      {remainingPart}
    </>
  );
}

export default ProfileLink;
