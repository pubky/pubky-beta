'use client';

import { twMerge } from 'tailwind-merge';
import {
  Post as PostUI,
  Icon,
  Button,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';
import { useEffect, useState } from 'react';

import { TLayouts, TSize } from '@/types';
import { PostView } from '@/types/Post';
import { Utils } from '@social/utils-shared';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { useUserProfile } from '@/hooks/useUser';
import { getPost } from '@/services/postService';

import Header from './_Header';
import Content from './_Content';
import Actions from './_Actions';
import Tags from './_Tags';
import TagsLargeView from './_TagsLargeView';
import Tooltip from '../Tooltip';

import RepostedPost from './_RepostedPost';
import DeletedPostMessage from './_DeletedPostMessage';
import MainPostContent from './_MainPostContent';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const { pubky, deletePost, setTimeline, setNewPosts } =
    usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { data } = useUserProfile(post?.details?.author, pubky ?? '');
  const [showModalTag, setShowModalTag] = useState(false);
  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const [repostedPost, setRepostedPost] = useState<PostView>();
  const [loadingRepostedPost, setLoadingRepostedPost] = useState(true);
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-neutral-800 after:content-[' * '] after:bg-neutral-800 after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[1px]`;

  const handleDeletePost = async () => {
    const result = await deletePost(post?.details?.id);
    if (result) {
      addAlert('Post deleted successfully');
      setTimeline((prevTimeline) =>
        prevTimeline.filter((p) => p.details.id !== post?.details?.id),
      );
      setNewPosts((prevNewPosts) =>
        prevNewPosts.filter((p) => p.details.id !== post?.details?.id),
      );
    } else {
      addAlert('Something wrong. Try again', 'warning');
    }
  };

  const fetchRepostedPost = async () => {
    if (post?.relationships?.reposted) {
      const url = post.relationships.reposted;

      const regex =
        /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;
      const match = url.match(regex);

      if (match) {
        const authorId = match[1];
        const postId = match[2];

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
                <div className="flex items-center relative">
                  {line && (
                    <>
                      <div className={twMerge(lineBaseCSS, lineStyle)} />
                      <div className="absolute ml-[10px]">
                        <Icon.LineHorizontal size="14" color="#262626" />
                      </div>
                    </>
                  )}
                  <PostUI.MainCard
                    className={twMerge(
                      line && 'ml-6',
                      largeView && 'p-12 inline-flex flex-row gap-12',
                      'relative',
                      rest.className,
                    )}
                  >
                    <div className="absolute top-3 right-3 flex gap-1">
                      <Tooltip.TooltipCheckMark content="Saved in your homeserver">
                        <Icon.CheckCircle
                          size="16"
                          color={
                            post?.cached === 'homeserver' ||
                            post?.cached === 'nexus'
                              ? '#00BA7C'
                              : 'white'
                          }
                          opacity={0.2}
                        />
                      </Tooltip.TooltipCheckMark>
                      <Tooltip.TooltipCheckMark content="Indexed by PubkyApp">
                        <Icon.CheckCircle
                          size="16"
                          color={post?.cached === 'nexus' ? '#00BA7C' : 'white'}
                          opacity={0.2}
                        />
                      </Tooltip.TooltipCheckMark>
                    </div>
                    <div className="flex-col justify-between inline-flex">
                      <div>
                        <Header post={post} largeView={largeView} />
                        <Content
                          largeView={largeView}
                          post={post}
                          fullContent={fullContent}
                        />
                      </div>
                      <RepostedPost
                        repostedPost={repostedPost}
                        loadingRepostedPost={loadingRepostedPost}
                        fullContent={fullContent}
                        lineStyle={lineStyle}
                        repostView
                        showModalTag={showModalTag}
                        setShowModalTag={setShowModalTag}
                        restClassName="mt-4"
                      />
                      <div
                        className={`flex flex-col md:flex-row ${
                          largeView ? 'gap-2' : 'justify-between'
                        }`}
                      >
                        {!repostView && (
                          <Tags
                            showModalTag={showModalTag}
                            setShowModalTag={setShowModalTag}
                            largeView={largeView}
                            post={post}
                          />
                        )}
                        {!repostView && (
                          <Actions
                            setShowModalTag={setShowModalTag}
                            post={post}
                          />
                        )}
                      </div>
                    </div>
                    {largeView && <TagsLargeView post={post} />}
                  </PostUI.MainCard>
                </div>
              ) : (
                <>
                  <div className="flex items-center relative">
                    {line && (
                      <>
                        <div className={twMerge(lineBaseCSS, lineStyle)} />
                        <div className="absolute ml-[10px]">
                          <Icon.LineHorizontal size="14" color="#262626" />
                        </div>
                      </>
                    )}
                    {/* Repost Card */}
                    <div
                      className={twMerge(
                        `${line && 'ml-6'} w-full`,
                        rest.className,
                      )}
                    >
                      <PostUI.RepostCard className="relative z-10 hover:z-50">
                        <div className="flex gap-2 items-center">
                          <Button.Action
                            className="bg-black bg-opacity-100 hover:bg-opacity-100 cursor-default"
                            size="small"
                            variant="custom"
                            icon={<Icon.Repost size="16" />}
                          />
                          <TooltipUI.Root
                            delay={500}
                            tagId="1"
                            setShowTooltip={setShowTooltipProfile}
                          >
                            <Link
                              href={`/profile/${post?.details?.author}`}
                              onClick={(event) => {
                                event.stopPropagation();
                              }}
                            >
                              <PostUI.Username className="text-[13px] text-opacity-80">
                                <span className="cursor-pointer hover:underline hover:decoration-solid">
                                  {data?.details?.name &&
                                    Utils.minifyText(data?.details?.name)}{' '}
                                </span>
                                reposted{' '}
                              </PostUI.Username>
                            </Link>
                            {showTooltipProfile !== '' && (
                              <Tooltip.Profile post={post} />
                            )}
                          </TooltipUI.Root>
                          {(!post?.details?.content ||
                            !post?.relationships?.reposted) &&
                            post?.details?.author === pubky && (
                              <Typography.Body
                                variant="small-bold"
                                className="text-[13px] text-red-500 text-opacity-80 hover:text-opacity-100 underline decoration-solid"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDeletePost();
                                }}
                              >
                                Undo repost
                              </Typography.Body>
                            )}
                        </div>
                        <PostUI.Time>
                          {Utils.timeAgo(post?.details?.indexed_at)}
                        </PostUI.Time>
                      </PostUI.RepostCard>
                      <RepostedPost
                        repostedPost={repostedPost}
                        loadingRepostedPost={loadingRepostedPost}
                        largeView={largeView}
                        fullContent={fullContent}
                        lineStyle={lineStyle}
                        repostView={repostView}
                        showModalTag={showModalTag}
                        setShowModalTag={setShowModalTag}
                        restClassName={twMerge(
                          'rounded-tl-none rounded-tr-none',
                          largeView && 'p-12 inline-flex flex-row gap-12',
                        )}
                      />
                    </div>
                  </div>
                </>
              )
            ) : post?.details?.content === '[DELETED]' ? (
              <DeletedPostMessage
                className={`${
                  post?.relationships?.replied && homeView && 'ml-6'
                } cursor-default`}
              />
            ) : (
              <MainPostContent
                post={post}
                largeView={largeView}
                fullContent={fullContent}
                line={line}
                lineStyle={lineStyle}
                repostView={repostView}
                showModalTag={showModalTag}
                setShowModalTag={setShowModalTag}
                restClassName={rest.className}
              />
            )}
          </div>
        </PostUI.Root>
      </div>
    </div>
  );
}
