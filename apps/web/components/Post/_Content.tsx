'use client';

import { Post as PostUI } from '@social/ui-shared';

import { IPost } from '@/types';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
  fullContent?: boolean;
  largeView?: boolean;
}

export default function Content({
  post,
  fullContent = false,
  largeView = false,
}: PostProps) {
  return (
    <div
      className="w-full cursor-text"
      onClick={(event) => event.stopPropagation()}
    >
      <PostUI.Content
        text={post?.post?.content}
        uri={post?.uri}
        fullContent={fullContent}
        largeView={largeView}
      />
    </div>
  );
}
