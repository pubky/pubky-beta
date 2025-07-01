import { Button, Icon, Post as PostUI, Typography, Tooltip as TooltipUI } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import Post from './_RepostedPost';
import Link from 'next/link';
import Tooltip from '@/components/Tooltip';
import { Utils } from '@/components/utils-shared';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUser';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';

interface QuoteProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  repostedPost: PostView;
  loadingRepostedPost: boolean;
  line?: boolean;
  repostView?: boolean;
  lineStyle?: string;
  largeView?: boolean;
  fullContent?: boolean;
  restClassName?: string;
}

export default function Quote({
  post,
  repostedPost,
  loadingRepostedPost,
  line,
  lineStyle,
  repostView,
  largeView,
  fullContent,
  restClassName,
  ...rest
}: QuoteProps) {
  const { pubky, deletePost } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const isMobile = useIsMobile();
  const { data } = useUserProfile(post?.details?.author, pubky ?? '');
  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const isCensored = Utils.isPostCensored(repostedPost);
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[0.5px]`;

  const handleDeletePost = async () => {
    const result = await deletePost(post);
    if (result) {
      addAlert('Post deleted!');
    } else {
      addAlert('Something wrong. Try again', 'warning');
    }
  };

  return (
    <div className="flex items-center relative">
      {line && (
        <>
          <div className={twMerge(lineBaseCSS, lineStyle)} />
          <div className="absolute ml-[10px]">
            <Icon.LineHorizontal size="14" color="#444447" />
          </div>
        </>
      )}
      {/* Repost Card */}
      <div className={twMerge(`${line && 'ml-6'} w-full`, restClassName)}>
        <PostUI.RepostCard className="relative">
          <div className="flex flex-wrap items-center">
            <Button.Action
              className="bg-black bg-opacity-100 hover:bg-opacity-100 cursor-default"
              size="small"
              variant="custom"
              icon={<Icon.Repost size="16" />}
            />
            <TooltipUI.Root delay={500} tagId="1" setShowTooltip={setShowTooltipProfile}>
              <Link
                href={`/profile/${post?.details?.author}`}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <PostUI.Username className="text-[13px] text-opacity-80">
                  <span className="cursor-pointer hover:underline hover:decoration-solid">
                    {data?.details?.name && Utils.minifyText(data?.details?.name, 14)}{' '}
                  </span>
                  reposted{' '}
                </PostUI.Username>
              </Link>
              {showTooltipProfile !== '' && !isMobile && <Tooltip.Profile post={post} />}
            </TooltipUI.Root>
            {(!post?.details?.content || !post?.relationships?.reposted) && post?.details?.author === pubky && (
              <Typography.Body
                variant="small-bold"
                className="ml-2 text-[13px] text-red-500 text-opacity-80 hover:text-opacity-100 underline decoration-solid"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeletePost();
                }}
              >
                Undo repost
              </Typography.Body>
            )}
          </div>
          <PostUI.Time repostView>{post?.details?.indexed_at}</PostUI.Time>
        </PostUI.RepostCard>
        <Post
          postType="single"
          isCensored={isCensored}
          repostedPost={repostedPost}
          loadingRepostedPost={loadingRepostedPost}
          largeView={largeView}
          fullContent={fullContent}
          lineStyle={lineStyle}
          repostView={repostView}
          restClassName={twMerge('rounded-tl-none rounded-tr-none', largeView && 'p-12 inline-flex flex-row gap-12')}
          notFoundClassName="rounded-t-none rounded-b-lg mt-0"
        />
      </div>
    </div>
  );
}
