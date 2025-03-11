'use client';

import React, { createContext, useContext, useState } from 'react';
import { PostView } from '@/types/Post';

type PostContextType = {
  post: PostView | undefined;
  setPost: React.Dispatch<React.SetStateAction<PostView | undefined>>;
};

const PostContext = createContext<PostContextType>({
  post: undefined,
  setPost: () => {}
});

export function PostWrapper({ children }: { children: React.ReactNode }) {
  const [post, setPost] = useState<PostView | undefined>(undefined);

  return <PostContext.Provider value={{ post, setPost }}>{children}</PostContext.Provider>;
}

export function usePostContext() {
  return useContext(PostContext);
}
