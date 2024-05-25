'use client';

import { Post as PostUI } from '@social/ui-shared';

import { Utils } from '../../utils';
import { IPost } from '../../types';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
  fullContent?: boolean;
}

export default function Post({ post, fullContent = false }: PostProps) {
  return (
    <div className="lg:inline-flex gap-12">
      <div className={post?.tags?.length > 0 ? 'lg:w-[60%]' : 'w-full'}>
        <PostUI.Content
          text={
            fullContent
              ? post?.post?.content
              : Utils.minifyText(post?.post?.content, 140)
          }
        />
      </div>
    </div>
  );
}
