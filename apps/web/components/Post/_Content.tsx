'use client';

import { Post as PostUI } from '@social/ui-shared';

import { Utils } from '@social/utils-shared';
import { IPost } from '../../types';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
  fullContent?: boolean;
}

export default function Content({ post, fullContent = true }: PostProps) {
  return (
    <div
      className="w-full cursor-text"
      onClick={(event) => event.stopPropagation()}
    >
      <PostUI.Content
        text={
          fullContent
            ? post?.post?.content
            : Utils.minifyText(post?.post?.content, 140)
        }
      />
    </div>
  );
}
