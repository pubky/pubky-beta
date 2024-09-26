'use client';

import React, { useState, useEffect } from 'react';

function ProfileLink({ pk }: { pk: string }) {
  //const { getUserIndexed } = useClientContext();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const pkMatch = pk.match(/pk:[a-zA-Z0-9]{52}/);
      if (pkMatch) {
        const pkFound = pkMatch[0];
        const result = null; //await getUserIndexed(pkFound.replace('pk:', '').trim());
        if (result) setUserName(result?.profile?.name);
      }
    };
    fetchUser();
  }, [pk]);

  const pkPart = pk.replace('pk:', '').trim();
  const remainingPart = pk.replace(`pk:${pkPart}`, '');

  return (
    <>
      <a className="text-white break-all" href={`/profile/${pkPart}`}>
        {userName ? `@${userName}` : 'Loading...'}
      </a>
      {remainingPart}
    </>
  );
}

export default ProfileLink;
