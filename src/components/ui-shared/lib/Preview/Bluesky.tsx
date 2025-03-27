'use client';

import { Post } from "bsky-react-post";
import { useEffect, useState } from 'react';

interface BlueskyProps {
  url: string;
}

export const Bluesky = ({ url }: BlueskyProps) => {
  const [handle, setHandle] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // Extract the handle and id from the URL
    const match = url.match(/\/profile\/([^/]+)\/post\/([^/]+)/);
    if (match) {
      const [, handle, id] = match;
      setHandle(handle);
      setId(id);
    }
  }, [url]);

  if (!handle || !id) {
    return null;
  }

  return (
    <div className="w-full max-w-[560px] relative border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden bg-stone-900">
      <Post handle={handle} id={id} />
    </div>
  );
};
