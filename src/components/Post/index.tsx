'use client';

import { twMerge } from 'tailwind-merge';
import { Post as PostUI, Icon } from '@social/ui-shared';
import { useEffect, useState } from 'react';

import { TLayouts, TSize } from '@/types';
import { PostType, PostView } from '@/types/Post';
import { Utils } from '@social/utils-shared';
import { usePubkyClientContext } from '@/contexts';
import { getPost } from '@/services/postService';
import DeletedPostMessage from './_DeletedPostMessage';
import MainPostContent from './_MainPostContent';
import { useRouter } from 'next/navigation';
import { parse_uri } from 'pubky-app-specs';
import Repost from './Repost';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  repostView?: boolean;
  replyView?: boolean;
  largeView?: boolean;
  homeView?: boolean;
  bookmark?: boolean;
  size?: TSize;
  post: PostView;
  layout?: TLayouts;
  fullContent?: boolean;
  line?: boolean;
  lineStyle?: string;
  postType: PostType;
}

export default function Post({
  repostView = false,
  replyView = false,
  largeView = false,
  homeView = false,
  size = 'full',
  post,
  layout,
  fullContent = false,
  line,
  lineStyle,
  postType,
  ...rest
}: PostProps) {
  const router = useRouter();
  const { pubky } = usePubkyClientContext();
  const [repostedPost, setRepostedPost] = useState<PostView>();
  const [loadingRepostedPost, setLoadingRepostedPost] = useState(true);
  const [showTags, setShowTags] = useState(false);
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[0.8px]`;
  const isCensored = (post?.relationships?.reposted && !repostView ? repostedPost : post)?.tags.some(
    (tag) => Utils.censoredTags.includes(tag.label) && tag.taggers[0] === process.env.NEXT_PUBLIC_MODERATION_ID
  );

  const handlePostClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      if (event.metaKey || event.ctrlKey || event.button === 1) {
        // Open in new tab
        window.open(Utils.encodePostUri(post?.details?.uri), '_blank');
      } else {
        router.push(Utils.encodePostUri(post?.details?.uri));
      }
    } else {
      event.stopPropagation();
    }
  };

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
    <div id="post-container" className="w-full cursor-pointer" onClick={handlePostClick} onAuxClick={handlePostClick}>
      <div className="flex flex-col">
        <PostUI.Root>
          <div>
            {post?.details?.content === '[DELETED]' ? (
              <div className="relative cursor-default" onClick={(event) => event.stopPropagation()}>
                {line && (
                  <>
                    <div className={twMerge(lineBaseCSS, lineStyle)} />
                    <div className="absolute ml-[10px]">
                      <Icon.LineHorizontal size="14" color="#444447" />
                    </div>
                  </>
                )}
                <DeletedPostMessage
                  className={`${post?.relationships?.replied && homeView && 'ml-6'} cursor-default`}
                />
              </div>
            ) : post?.relationships?.reposted && !repostView ? (
              post?.details?.content || (post?.details?.attachments && post?.details?.attachments.length > 0) ? (
                <Repost.Blank
                  postType={postType}
                  post={post}
                  repostedPost={repostedPost}
                  loadingRepostedPost={loadingRepostedPost}
                  repostView={repostView}
                  line={line}
                  lineStyle={lineStyle}
                  largeView={largeView}
                  fullContent={fullContent}
                  showTags={showTags}
                  setShowTags={setShowTags}
                  isCensored={isCensored}
                  restClassName={rest.className}
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
                  isCensored={isCensored}
                  restClassName={rest.className}
                />
              )
            ) : (
              <MainPostContent
                post={post}
                largeView={largeView}
                fullContent={fullContent}
                line={line}
                lineStyle={lineStyle}
                repostView={repostView}
                replyView={replyView}
                postType={postType}
                showTags={showTags}
                setShowTags={setShowTags}
                isCensored={isCensored}
                restClassName={rest.className}
              />
            )}
          </div>
        </PostUI.Root>
      </div>
    </div>
  );
}
