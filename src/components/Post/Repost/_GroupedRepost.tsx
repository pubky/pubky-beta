import { Button, Icon, Post as PostUI, Typography, Tooltip as TooltipUI } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import Post from './_RepostedPost';
import Link from 'next/link';
import Tooltip from '@/components/Tooltip';
import { Utils } from '@/components/utils-shared';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUser';
import { useAlertContext, useModal, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';

interface GroupedRepostProps extends React.HTMLAttributes<HTMLDivElement> {
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

export default function GroupedRepost({
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
}: GroupedRepostProps) {
  const { pubky, deletePost } = usePubkyClientContext();
  const { openModal } = useModal();
  const { addAlert } = useAlertContext();
  const isMobile = useIsMobile();
  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const isCensored = Utils.isPostCensored(repostedPost);
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[0.5px]`;

  // Get unique reposters and their data
  const uniqueReposters = post.uniqueReposters || [];

  // Check if current user is among the reposters
  const currentUserReposted = uniqueReposters.includes(pubky ?? '');

  // Get user data for the first few reposters
  const displayReposters = uniqueReposters.slice(0, 2);
  const remainingCount = uniqueReposters.length - 2;

  // Fetch user data for display reposters
  const { data: firstUserData } = useUserProfile(displayReposters[0] || '', pubky ?? '');
  const { data: secondUserData } = useUserProfile(displayReposters[1] || '', pubky ?? '');

  // Helper function to recursively find all reposts from the current user
  const findAllUserReposts = (reposts: PostView[]): PostView[] => {
    const userReposts: PostView[] = [];

    reposts.forEach((repost) => {
      // Check if this repost is from the current user
      if (repost.details.author === pubky) {
        userReposts.push(repost);
      }

      // Recursively check nested grouped reposts
      if (repost.groupedReposts && repost.groupedReposts.length > 0) {
        userReposts.push(...findAllUserReposts(repost.groupedReposts));
      }
    });

    return userReposts;
  };

  const handleDeletePost = async () => {
    if (!post.groupedReposts) return;

    // Find all reposts from the current user (including nested ones)
    const userReposts = findAllUserReposts(post.groupedReposts);
    if (userReposts.length === 0) return;

    // Delete all reposts from the current user
    const deletePromises = userReposts.map((userRepost) => deletePost(userRepost));

    try {
      const result = await Promise.all(deletePromises);

      if (result) addAlert('Repost deleted!');
      else addAlert('Something wrong. Try again', 'warning');
    } catch (error) {
      console.error('Error deleting reposts:', error);
      addAlert('Something wrong. Try again', 'warning');
    }
  };

  const getDisplayName = (userId: string, userData: any) => {
    if (userData?.details?.name) {
      return Utils.minifyText(userData.details.name, 14);
    }
    return Utils.minifyText(userId, 14);
  };

  const renderUserLink = (userId: string, userData: any, index: number) => {
    const displayName = getDisplayName(userId, userData);
    const tooltipId = `reposter-${index}`;

    return (
      <TooltipUI.Root key={userId} delay={500} tagId={tooltipId} setShowTooltip={setShowTooltipProfile}>
        <Link
          href={`/profile/${userId}`}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <PostUI.Username className="text-[13px] text-opacity-80">
            <span className="cursor-pointer hover:underline hover:decoration-solid">{displayName}</span>
          </PostUI.Username>
        </Link>
        {showTooltipProfile === tooltipId && !isMobile && (
          <Tooltip.Profile post={{ ...post, details: { ...post.details, author: userId } }} />
        )}
      </TooltipUI.Root>
    );
  };

  const renderRepostersText = () => {
    if (displayReposters.length === 0) return null;

    if (displayReposters.length === 1) {
      return (
        <div className="flex flex-wrap items-center">
          {renderUserLink(displayReposters[0], firstUserData, 0)}
          <span className="ml-1 text-[13px] text-white text-opacity-80">reposted</span>
        </div>
      );
    }

    // If we have exactly 2 reposters total (no remaining)
    if (displayReposters.length === 2 && remainingCount === 0) {
      return (
        <div className="flex flex-wrap items-center">
          {renderUserLink(displayReposters[0], firstUserData, 0)}
          <span className="mx-1 text-[13px] text-white text-opacity-80">and</span>
          {renderUserLink(displayReposters[1], secondUserData, 1)}
          <span className="ml-1 text-[13px] text-white text-opacity-80">reposted</span>
        </div>
      );
    }

    // If we have more than 2 reposters total
    if (remainingCount > 0) {
      return (
        <div className="flex flex-wrap items-center">
          {renderUserLink(displayReposters[0], firstUserData, 0)}
          <span className="text-[13px] text-white text-opacity-80">,</span>
          <span className="text-[13px] text-white text-opacity-80">&nbsp;</span>
          <div className="flex flex-wrap items-center">
            {renderUserLink(displayReposters[1], secondUserData, 1)}
            <span className="ml-1 text-[13px] text-white text-opacity-80">and</span>
            <span className="ml-1 text-[13px] text-white text-opacity-80">
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  openModal('repostedUsers', { users: uniqueReposters });
                }}
                className="underline cursor-pointer"
              >
                {remainingCount} {remainingCount > 1 ? 'others' : 'other'}
              </span>{' '}
              reposted
            </span>
          </div>
        </div>
      );
    }

    // Fallback case
    return (
      <div className="flex flex-wrap items-center">
        {renderUserLink(displayReposters[0], firstUserData, 0)}
        <span className="ml-1 text-[13px] text-white text-opacity-80">,</span>
        {renderUserLink(displayReposters[1], secondUserData, 1)}
        <span className="ml-1 text-[13px] text-white text-opacity-80">reposted</span>
      </div>
    );
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
      {/* Grouped Repost Card */}
      <div className={twMerge(`${line && 'ml-6'} w-full`, restClassName)}>
        <PostUI.RepostCard className="relative">
          <div className="flex gap-2 items-center">
            <Button.Action
              className="bg-black bg-opacity-100 hover:bg-opacity-100 cursor-default"
              size="small"
              variant="custom"
              icon={<Icon.Repost size="16" />}
            />
            <div className="flex flex-wrap items-center">
              {renderRepostersText()}
              {currentUserReposted && (
                <Typography.Body
                  variant="small-bold"
                  className="ml-2 sm:ml-2 text-[13px] text-red-500 text-opacity-80 hover:text-opacity-100 underline decoration-solid"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeletePost();
                  }}
                >
                  Undo repost
                </Typography.Body>
              )}
            </div>
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
