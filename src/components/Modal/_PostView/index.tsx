'use client';

import { useRouter } from 'next/navigation';
import { Post } from '@/components';
import { PostView } from '@/types/Post';
import { usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useEffect, useRef, useState } from 'react';
import { Content } from '@social/ui-shared';
import * as Components from '@/components';
import { Icon } from '@social/ui-shared';
import { PubkyAppPostKind } from 'pubky-app-specs';
import { useUserProfile } from '@/hooks/useUser';
import { Utils } from '@social/utils-shared';
import { Typography, Post as PostUI } from '@social/ui-shared';
import { ImageByUri } from '@/components/ImageByUri';
import Tags from '@/components/Post/Tags';
import { Header } from './components/_Header';
import RootParent from './components/_RootParent';
import PostRoot from './components/_PostRoot';
import { ImageArticle } from './components/_ImageArticle';

interface PostViewModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function PostViewModal({ showModal, setShowModal, post }: PostViewModalProps) {
  const router = useRouter();
  const { pubky, setReplies } = usePubkyClientContext();
  const isMobile = useIsMobile(1024);
  const replyPostRef = useRef<HTMLDivElement>(null);
  const user = useUserProfile(post?.details?.author, pubky ?? '');
  const urlUpdated = useRef<boolean>(false);
  const originalTitle = useRef<string>('');
  const [postKey, setPostKey] = useState<string>('');

  // Reset replies when modal opens and update post key for proper re-rendering
  useEffect(() => {
    if (showModal && post) {
      setReplies([]);
      // Create a unique key for the post to force re-rendering of child components
      setPostKey(`${post.details.author}-${post.details.id}`);
    }
  }, [showModal, post, setReplies]);

  // Handle post prop changes
  useEffect(() => {
    if (showModal && post) {
      // Reset URL updated flag when post changes
      urlUpdated.current = false;
      // Update post key when post changes to ensure clean re-render
      setPostKey(`${post.details.author}-${post.details.id}`);
    }
  }, [post, showModal]);

  // Handle page title when modal opens/closes
  useEffect(() => {
    if (showModal) {
      // Store original title
      originalTitle.current = document.title;

      // Set appropriate title based on post type
      if (String(post?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase()) {
        // Long post (article)
        try {
          const content = JSON.parse(post?.details?.content);
          const postTitle = Utils.truncateText(content.title, 20);
          const profileName = Utils.truncateText(
            user?.data?.details?.name || Utils.minifyPubky(post?.details?.author),
            20
          );
          document.title = `${postTitle} | ${profileName} on Pubky`;
        } catch {
          const profileName = Utils.truncateText(
            user?.data?.details?.name || Utils.minifyPubky(post?.details?.author),
            20
          );
          document.title = `${profileName} on Pubky`;
        }
      } else {
        // Regular post
        const profileName = Utils.truncateText(
          user?.data?.details?.name || Utils.minifyPubky(post?.details?.author),
          20
        );
        document.title = `${profileName} on Pubky`;
      }
    } else {
      // Restore original title when modal closes
      if (originalTitle.current) {
        document.title = originalTitle.current;
      }
    }

    return () => {
      // Cleanup: restore original title if component unmounts
      if (originalTitle.current) {
        document.title = originalTitle.current;
      }
    };
  }, [showModal, post, user]);

  // Handle URL updates and browser back button
  useEffect(() => {
    if (!showModal) return;

    // Only update URL if it hasn't been updated yet
    if (!urlUpdated.current) {
      // Determine which URI to use for the URL
      const uriToUse =
        post.details.content === '' && post.relationships?.reposted ? post.relationships.reposted : post.details.uri;

      const postUrl = Utils.encodePostUri(uriToUse);

      // Check if we're already on the post URL to prevent duplicate pushState
      if (window.location.pathname !== postUrl) {
        window.history.pushState({ modal: 'postView', postUrl }, '', postUrl);
        urlUpdated.current = true;
      } else {
        // We're already on the correct URL, just mark as updated
        urlUpdated.current = true;
      }
    }

    const handlePopState = (event: PopStateEvent) => {
      // If we're going back to a previous state, close the modal
      if (!event.state?.modal) {
        setShowModal(false);
        urlUpdated.current = false;
      }
    };

    // Listen for popstate (back button)
    window.addEventListener('popstate', handlePopState);

    // Disable background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Re-enable background scrolling when modal closes
      document.body.style.overflow = '';
    };
  }, [showModal, setShowModal, post]);

  const handleClose = () => {
    setShowModal(false);
    urlUpdated.current = false;
    // Go back to previous URL
    router.back();
  };

  // Handle internal navigation (clicks on links within the modal)
  const handleInternalNavigation = (href: string) => {
    setShowModal(false);
    urlUpdated.current = false;
    router.push(href);
  };

  // Cleanup effect to ensure proper cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (urlUpdated.current) {
        urlUpdated.current = false;
      }
      // Re-enable background scrolling
      document.body.style.overflow = '';
    };
  }, []);

  if (!showModal) return null;

  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[0.8px]`;

  const isLongPost = String(post?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase();

  const renderMainPost = () => {
    if (isLongPost) {
      return (
        <LongPost
          key={`longpost-${postKey}`}
          data={post}
          user={user}
          onInternalNavigation={handleInternalNavigation}
          postKey={postKey}
        />
      );
    } else {
      return (
        <div className="flex items-center relative">
          {post?.relationships?.replied && (
            <>
              <div className={lineBaseCSS} />
              <div className="absolute ml-[10px]">
                <Icon.LineHorizontal size="14" color="#444447" />
              </div>
            </>
          )}
          <Post
            key={`post-${postKey}`}
            post={post}
            postType="single"
            largeView={!isMobile}
            fullContent
            className={post?.relationships?.replied ? 'ml-6' : ''}
          />
        </div>
      );
    }
  };

  return (
    <div id="post-view-modal" className="fixed inset-0 z-50 bg-[#05050A]">
      <div className="flex flex-col h-full">
        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-webkit">
          <Content.Main className="pt-[80px]">
            <Header />

            <Content.Grid className="flex justify-between flex-col gap-3">
              {/* Show parent posts if this is a reply */}
              {post?.relationships?.replied && (
                <RootParent key={`parent-${postKey}`} postRef={replyPostRef} parentURI={post?.relationships?.replied} />
              )}

              {/* Main post */}
              <div key={`main-post-${postKey}`} ref={replyPostRef} className="scroll-mt-20">
                {renderMainPost()}
              </div>

              {/* Replies section */}
              <div className="mt-3">
                <PostRoot key={`replies-${postKey}`} uri={post?.details?.id} post={post} />
              </div>
            </Content.Grid>

            <Components.CreatePost />
            <Components.FooterMobile />
          </Content.Main>
        </div>
      </div>
    </div>
  );
}

const LongPost = ({ data, user, onInternalNavigation, postKey }) => {
  const [isUnblurred, setIsUnblurred] = useState(false);
  const blurCensored = Utils.storage.get('blurCensored') as boolean;
  const content = (() => {
    try {
      return JSON.parse(data?.details?.content);
    } catch (error) {
      return { title: Utils.minifyText(data?.details?.content, 20), body: data?.details?.content };
    }
  })();
  const isCensored = Utils.isPostCensored(data);
  const censored = !isUnblurred && isCensored && (blurCensored === false ? false : true);

  useEffect(() => {
    if (data?.details?.id && isCensored) {
      const unblurredPosts = (Utils.storage.get('unblurred_posts') as string[]) || [];
      setIsUnblurred(unblurredPosts.includes(data.details.id));
    }
  }, [data?.details?.id, isCensored]);

  const handleUnblur = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (data?.details?.id) {
      const unblurredPosts = (Utils.storage.get('unblurred_posts') as string[]) || [];
      if (!unblurredPosts.includes(data.details.id)) {
        Utils.storage.set('unblurred_posts', [...unblurredPosts, data.details.id]);
      }
    }
    setIsUnblurred(true);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onInternalNavigation(`/profile/${data?.details?.author}`);
  };

  return (
    <div key={`longpost-container-${postKey}`} className="w-full">
      <div className="flex flex-col lg:flex-row gap-6 relative">
        <div className={`${censored && 'blur-2xl'} w-auto lg:w-[1200px] flex flex-col gap-4`}>
          <Typography.Display className="sm:leading-[64px] break-words">{content.title}</Typography.Display>
          <div className="flex w-full gap-4 justify-between items-center">
            <div className="justify-start gap-3 flex items-center mt-4 mb-2">
              <ImageByUri
                key={`avatar-${postKey}`}
                id={user?.data?.details?.id}
                isCensored={Utils.isProfileCensored(user)}
                width={48}
                height={48}
                className="w-[32px] h-[32px] md:w-[48px] md:h-[48px] rounded-full"
                alt="user-image"
              />
              <a
                className="cursor-pointer flex flex-col md:flex-row md:gap-4 md:items-center"
                href={`/profile/${data?.details?.author}`}
                onClick={handleProfileClick}
              >
                <Typography.Body className={`text-2xl hover:underline hover:decoration-solid`} variant="medium-bold">
                  {Utils.minifyText(user?.data?.details?.name ?? Utils.minifyPubky(data?.details?.author), 24)}
                </Typography.Body>
                <div className="flex gap-1 -mt-1 md:mt-1 cursor-pointer">
                  <Typography.Label className="text-opacity-30">
                    {Utils.minifyPubky(data?.details?.author ?? '')}
                  </Typography.Label>
                </div>
              </a>
            </div>
            <PostUI.Time articleView className="mr-2 cursor-default">
              {data?.details?.indexed_at}
            </PostUI.Time>
          </div>
          {data?.details?.attachments?.length > 0 && data?.details?.attachments[0] && (
            <ImageArticle
              key={`image-${postKey}`}
              uri={data?.details?.attachments[0]}
              width={1200}
              height={650}
              className="w-[1200px] h-auto rounded-lg mb-4"
              alt="article-image"
            />
          )}
          <div
            className="text-white break-words no-html-margins [&_a]:text-[#C8FF00] [&_a:hover]:text-[#C8FF00]/90 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-4 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_ol]:pl-0 [&_li[data-list='ordered']]:list-decimal [&_li[data-list='ordered']]:list-inside [&_li[data-list='bullet']]:before:content-['•'] [&_li[data-list='bullet']]:before:mr-2 [&_li[data-list='bullet']]:list-none [&_blockquote]:border-l-4 [&_blockquote]:border-[#444447] [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_.ql-code-block-container]:bg-[#1E1E1E] [&_.ql-code-block-container]:p-4 [&_.ql-code-block-container]:rounded-lg [&_.ql-code-block-container]:font-mono [&_.ql-code-block-container]:text-sm [&_.ql-code-block-container]:my-4 [&_.ql-code-block-container]:overflow-x-auto [&_.ql-code-block-container]:whitespace-pre [&_.ql-code-block]:whitespace-pre-wrap [&_.ql-align-right]:text-right [&_.ql-align-center]:text-center [&_.ql-align-justify]:text-justify"
            dangerouslySetInnerHTML={{
              __html: Utils.sanitizeUrlsArticle(content.body)
            }}
          />
        </div>
        {censored && (
          <div
            className="absolute top-4 left-0 right-0 lg:right-auto lg:left-[100px] xl:left-[250px] flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg"
            onClick={handleUnblur}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Icon.EyeSlash size="32px" color="white" />
              <Typography.Body variant="small" className="text-center text-white">
                This article may contain sexually explicit content
              </Typography.Body>
            </div>
          </div>
        )}
        <Tags.LargeView key={`tags-${postKey}`} post={data} postType="single" articleView />
      </div>
    </div>
  );
};
