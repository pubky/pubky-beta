'use client';

import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { parse_uri } from 'pubky-app-specs';
import { useRouter } from 'next/navigation';

import { TLayouts, TSize } from '@/types';
import { PostView } from '@/types/Post';

import { Post as PostUI, Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { usePubkyClientContext } from '@/contexts';
import { getPost } from '@/services/postService';
import { PostComponents } from './components';
import { Repost } from './Repost';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  repostView?: boolean;
  largeView?: boolean;
  homeView?: boolean;
  bookmark?: boolean;
  size?: TSize;
  post: PostView;
  layout?: TLayouts;
  fullContent?: boolean;
  line?: boolean;
  lineStyle?: string;
}

export default function Post({
  repostView = false,
  largeView = false,
  homeView = false,
  size = 'full',
  post,
  layout,
  fullContent = false,
  line,
  lineStyle,
  ...rest
}: PostProps) {
  const router = useRouter();
  const { pubky } = usePubkyClientContext();

  const [repostedPost, setRepostedPost] = useState<PostView>();
  const [loadingRepostedPost, setLoadingRepostedPost] = useState(true);
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[0.5px]`;

  const fetchRepostedPost = async () => {
    if (post?.relationships?.reposted) {
      const url = post.relationships.reposted;
      const parsed = parse_uri(url);

      if (parsed.resource == 'posts') {
        const authorId = parsed.user_id;
        const postId = parsed.resource_id!;
        const result = await getPost(authorId, postId, pubky ?? '');
        setRepostedPost(result);
        setLoadingRepostedPost(false);
      } else {
        console.error('URI reposted not valid');
        setLoadingRepostedPost(false);
      }
    }
  };

  useEffect(() => {
    fetchRepostedPost();
  }, [post?.relationships?.reposted]);

  return (
    <div
      id="post-container"
      className="w-full cursor-pointer"
      onClick={(event) => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          router.push(Utils.encodePostUri(post?.details?.uri));
        } else {
          event.stopPropagation();
        }
      }}
    >
      <div className="flex flex-col">
        <PostUI.Root>
          <div>
            {post?.relationships?.reposted && !repostView ? (
              post?.details?.content || post?.details?.attachments ? (
                <Repost.Blank
                  post={post}
                  repostedPost={repostedPost}
                  loadingRepostedPost={loadingRepostedPost}
                  repostView={repostView}
                  line={line}
                  lineStyle={lineStyle}
                  largeView={largeView}
                  fullContent={fullContent}
                />
              ) : (
                <Repost.Quote
                  post={post}
                  repostedPost={repostedPost}
                  loadingRepostedPost={loadingRepostedPost}
                  repostView={repostView}
                  line={line}
                  lineStyle={lineStyle}
                  largeView={largeView}
                  fullContent={fullContent}
                />
              )
            ) : post?.details?.content === '[DELETED]' ? (
              <div className="relative cursor-default" onClick={(event) => event.stopPropagation()}>
                {line && (
                  <>
                    <div className={twMerge(lineBaseCSS, lineStyle)} />
                    <div className="absolute ml-[10px]">
                      <Icon.LineHorizontal size="14" color="#444447" />
                    </div>
                  </>
                )}
                <PostComponents.DeletedPostMessage
                  className={`${post?.relationships?.replied && homeView && 'ml-6'} cursor-default`}
                />
              </div>
            ) : (
              <PostComponents.MainPostContent
                post={post}
                largeView={largeView}
                fullContent={fullContent}
                line={line}
                lineStyle={lineStyle}
                repostView={repostView}
                restClassName={rest.className}
              />
            )}
          </div>
        </PostUI.Root>
      </div>
    </div>
  );
}
