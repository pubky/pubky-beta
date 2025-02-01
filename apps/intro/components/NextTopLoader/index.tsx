'use client';

import NextTopLoader from 'nextjs-toploader';
import React, { useEffect, useState } from 'react';

export default function NextTopLoaderComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div className="z-index-999">
        <NextTopLoader color="white" />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
        </div>
      ) : (
        children
      )}
    </>
  );
}
