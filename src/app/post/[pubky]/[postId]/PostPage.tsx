'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PubkyAppPostKind, parse_uri } from 'pubky-app-specs';

// UI Components
import { Icon, Button, Typography, SideCard, Post as PostUI } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { SinglePost as PostComponent, SimplePostTags, ImageByUri } from '@/components';
import { Skeletons } from '@/components/Skeletons';
import CreateContent from '@/components/CreateContent';

// Hooks & Contexts
import { usePost, usePostReplies } from '@/hooks/usePost';
import { useUserProfile } from '@/hooks/useUser';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePostContext, usePubkyClientContext, useAlertContext } from '@/contexts';

// Services
import { getPost } from '@/services/postService';

// Types
import { PostView } from '@/types/Post';

// Types for parent posts state
interface ParentPostState {
  [uri: string]: {
    post: PostView | null;
    loading: boolean;
  };
}

/**
 * Main post page component that handles the rendering of a post and its replies
 */
export function PostPage({ params }: { params: Promise<{ pubky: string; postId: string }> }) {
  const { pubky, setReplies, mutedUsers, replies, deletedPosts, createReply, createTag, follow, unfollow } =
    usePubkyClientContext();
  const { setPost } = usePostContext();
  const { addAlert } = useAlertContext();

  // Refs
  const postRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // State management for params and participants
  const [resolvedParams, setResolvedParams] = useState<{
    pubky: string;
    postId: string;
  } | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const { pubky: paramsPubky, postId: paramsPostId } = resolvedParams ?? { pubky: '', postId: '' };

  // Post data fetching
  const { data: postData, isLoading: postLoading, isError: postError } = usePost(paramsPubky, paramsPostId, pubky);
  const { data: userData } = useUserProfile(postData?.details?.author ?? '', pubky ?? '');

  // State for replies
  const limit = 5;
  const [start, setStart] = useState<number | undefined>(undefined);
  const [repliesLocal, setRepliesLocal] = useState<PostView[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Replies data fetching
  const { data: repliesData, isLoading: repliesLoading } = usePostReplies(
    postData?.details?.author ?? '',
    postData?.details?.id ?? '',
    pubky,
    undefined,
    limit,
    start
  );

  // Create reply state
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isValidContent, setIsValidContent] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [contentReply, setContentReply] = useState('');
  const [quote, setQuote] = useState<string>();
  const [sendingReply, setSendingReply] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [placeholder, setPlaceholder] = useState('');

  // Parent posts state
  const [isMobileParent, setIsMobileParent] = useState(false);
  const [parentURIs, setParentURIs] = useState<string[]>([]);
  const [parentPosts, setParentPosts] = useState<ParentPostState>({});

  // Check mobile for parent posts
  const checkMobileParent = () => {
    setIsMobileParent(window.innerWidth < 1280);
  };

  // Fetch chain of parent URIs recursively
  const fetchParentURIs = async (parentURI: string, collectedURIs: string[]): Promise<string[]> => {
    if (!parentURI) return collectedURIs;
    collectedURIs.push(parentURI);
    try {
      const parsed = parse_uri(parentURI);
      if (parsed.resource == 'posts') {
        const authorId = parsed.user_id;
        const postId = parsed.resource_id!;
        const parentPost = await getPost(authorId, postId, pubky ?? '');
        if (parentPost?.relationships?.replied) {
          return await fetchParentURIs(parentPost?.relationships?.replied, collectedURIs);
        }
      }
    } catch (error) {
      console.error('Error fetching parent post:', error);
    }
    return collectedURIs;
  };

  // Fetch all parent URIs
  const fetchParentPosts = async (parentURI: string) => {
    try {
      if (parentURI) {
        const parentURIList = await fetchParentURIs(parentURI, []);
        setParentURIs(parentURIList);
      }
    } catch (error) {
      console.error('Error fetching parent URIs:', error);
    }
  };

  // Fetch individual parent post
  const fetchPost = async (parentURI: string) => {
    try {
      setParentPosts((prevState) => ({
        ...prevState,
        [parentURI]: { post: null, loading: true }
      }));
      const parsed = parse_uri(parentURI);
      if (parsed.resource == 'posts') {
        const authorId = parsed.user_id;
        const postId = parsed.resource_id!;
        const post = await getPost(authorId, postId, pubky ?? '');
        setParentPosts((prevState) => ({
          ...prevState,
          [parentURI]: { post: post || null, loading: false }
        }));
      }
    } catch (error) {
      console.error('Error fetching parent post:', error);
      setParentPosts((prevState) => ({
        ...prevState,
        [parentURI]: { post: null, loading: false }
      }));
    }
  };

  // Parent posts effects
  useEffect(() => {
    checkMobileParent();
    window.addEventListener('resize', checkMobileParent);
    return () => window.removeEventListener('resize', checkMobileParent);
  }, []);

  useEffect(() => {
    if (postData?.relationships?.replied) {
      fetchParentPosts(postData.relationships.replied);
    }
  }, [postData?.relationships?.replied]);

  useEffect(() => {
    parentURIs.forEach((parentURI) => {
      if (!parentPosts[parentURI]) {
        fetchPost(parentURI);
      }
    });
  }, [parentURIs, parentPosts]);

  // Check if all parent posts are loaded
  const allParentPostsLoaded = parentURIs.every((uri) => parentPosts[uri]?.loading === false);

  // Scroll to current post when parents are loaded
  useEffect(() => {
    if (allParentPostsLoaded && postRef?.current) {
      postRef.current.scrollIntoView();
    }
  }, [allParentPostsLoaded]);

  // Resolve parameters
  useEffect(() => {
    params.then((p) => setResolvedParams(p));
  }, [params]);

  // Set post data in context
  useEffect(() => {
    if (postData) {
      setPost(postData);
    }
  }, [postData, setPost]);

  // Clear replies and reset state when post changes
  useEffect(() => {
    if (!postData?.details?.id) return;

    setRepliesLocal([]);
    setReplies([]);
    setIsInitialLoad(true);
    setInitialLoadComplete(false);
    setHasMore(true);
    setStart(undefined);
    setPlaceholder(Utils.promptPlaceholder('reply'));
  }, [setReplies, postData?.details?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setResolvedParams(null);
      setPost(undefined);
      setRepliesLocal([]);
      setReplies([]);
    };
  }, [setReplies, setPost]);

  // Fetch reply data
  useEffect(() => {
    if (repliesData) {
      if (isInitialLoad) {
        // Sort replies by indexed_at in descending order (newest first)
        const sortedReplies = [...repliesData].sort((a, b) => b.details.indexed_at - a.details.indexed_at);
        setRepliesLocal(sortedReplies);
        setReplies(sortedReplies);
        setIsInitialLoad(false);
        setInitialLoadComplete(true);
      } else {
        // Merge new replies with existing ones, avoiding duplicates and maintaining order
        setRepliesLocal((prev) => {
          const newReplies = repliesData.filter(
            (newReply) => !prev.some((existingReply) => existingReply.details.id === newReply.details.id)
          );
          const combined = [...prev, ...newReplies];
          return combined.sort((a, b) => b.details.indexed_at - a.details.indexed_at);
        });

        setReplies((prev) => {
          const newReplies = repliesData.filter(
            (newReply) => !prev.some((existingReply) => existingReply.details.id === newReply.details.id)
          );
          const combined = [...prev, ...newReplies];
          return combined.sort((a, b) => b.details.indexed_at - a.details.indexed_at);
        });
      }

      if (repliesData.length < limit) {
        setHasMore(false);
      }
    }
  }, [repliesData, isInitialLoad, limit, setReplies]);

  // Fetch participants effect
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!postData?.details?.id || !postData?.details?.author) return;

      setLoadingParticipants(true);
      try {
        // Get unique authors from replies
        const uniqueAuthors = [...new Set(repliesLocal.map((reply) => reply.details.author))];

        // Filter out muted users and the post author (since they're shown separately)
        const filteredParticipants = uniqueAuthors.filter(
          (author) => !mutedUsers?.includes(author) && author !== postData.details.author
        );

        setParticipants(filteredParticipants);
      } catch (error) {
        console.error('Error processing participants:', error);
        setParticipants([]);
      } finally {
        setLoadingParticipants(false);
      }
    };

    fetchParticipants();
  }, [postData?.details?.id, postData?.details?.author, repliesLocal, mutedUsers]);

  // Infinite scrolling for replies
  const fetchNextReplies = () => {
    if (!repliesLocal.length || !hasMore || repliesLoading) return;

    // Get the oldest reply's indexed_at for the next page
    const oldestReply = repliesLocal.reduce((oldest, current) =>
      current.details.indexed_at < oldest.details.indexed_at ? current : oldest
    );
    setStart(oldestReply.details.indexed_at);
  };

  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && initialLoadComplete && !repliesLoading) {
          fetchNextReplies();
        }
      },
      { threshold: 0.5 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [initialLoadComplete, repliesLocal, hasMore, repliesLoading]);

  // Nexus data fetching
  const fetchNexusData = async () => {
    if (!replies.length) return;

    const homeserverReplies = replies.filter((reply) => reply.cached === 'homeserver' || reply.cached === undefined);
    if (!homeserverReplies.length) return;

    try {
      const nexusPromises = homeserverReplies.map(async (reply) => {
        try {
          return await getPost(reply.details.author, reply.details.id, pubky);
        } catch (error) {
          return null;
        }
      });

      const nexusResults = await Promise.all(nexusPromises);
      const validResults = nexusResults.filter(Boolean);

      if (validResults.length) {
        setReplies((prevReplies) =>
          prevReplies.map((reply) => {
            const nexusReply = validResults.find((nr) => nr?.details?.id === reply.details.id);
            return nexusReply ? { ...nexusReply, cached: 'nexus' } : reply;
          })
        );
      }
    } catch (error) {
      console.error('Error fetching Nexus data:', error);
    }
  };

  // Fetch Nexus data effect
  useEffect(() => {
    fetchNexusData();
  }, [replies]);

  // Handle reply submission
  const handleReply = async (content: string) => {
    if (!pubky) return;

    setSendingReply(true);

    try {
      const sendReply = await createReply(
        postData?.details?.uri,
        content,
        PubkyAppPostKind.Short,
        selectedFiles,
        quote
      );
      if (!sendReply) {
        addAlert('Failed to create reply', 'warning');
        return;
      }

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];
      const postId = parse_uri(sendReply).resource_id!;

      // Create tags
      for (const tag of updatedTags) {
        await createTag(pubky, postId, tag);
      }

      // Try to fetch the new reply with retries
      let newReplyData = null;
      let retries = 3;

      while (retries > 0 && !newReplyData) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before trying
          newReplyData = await getPost(pubky, postId, pubky);
        } catch (error) {
          console.error(`Error fetching new reply (${retries} retries left):`, error);
          retries--;
        }
      }

      if (newReplyData) {
        // Add the new reply to both local and global state
        setRepliesLocal((prev) => [newReplyData, ...prev]);
        setReplies((prev) => [newReplyData, ...prev]);
      }

      // Reset form state
      setContentReply('');
      setArrayTags([]);
      setIsValidContent(false);
      setSelectedFiles([]);
      setTextArea(false);

      addAlert(
        <>
          Reply created!{' '}
          <a
            className="text-[#c8ff00] font-bold text-opacity-90 hover:text-opacity-100"
            href={Utils.encodePostUri(sendReply)}
          >
            View
          </a>
        </>
      );
    } catch (error) {
      console.error('Error creating reply:', error);
      addAlert('Failed to create reply', 'warning');
    } finally {
      setSendingReply(false);
    }
  };

  // Render loading state
  if (postLoading) {
    return <Skeletons.Simple />;
  }

  // Render error state
  if (postError) {
    return (
      <div className="ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
        <Typography.Body variant="small" className="text-opacity-50 text-center">
          This post was not found or has been deleted by its author.
          <Link href="/home" className="ml-2 text-white text-opacity-80 hover:text-opacity-100 cursor-pointer">
            Go home
          </Link>
        </Typography.Body>
      </div>
    );
  }

  // Render deleted post
  if (postData?.details?.content === '[DELETED]') {
    return (
      <div className="ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-lg">
        <Typography.Body variant="small" className="text-opacity-50 text-center">
          This post has been deleted by its author.
          <Link href="/home" className="ml-2 text-white text-opacity-80 hover:text-opacity-100 cursor-pointer">
            Go home
          </Link>
        </Typography.Body>
      </div>
    );
  }

  // Fix: Use direct string comparison without enum reference that's causing typing issues
  const isArticle = typeof postData?.details?.kind === 'string' && postData?.details?.kind === 'long';

  return (
    <div className="w-full">
      {/* Parent Posts Chain */}
      {postData?.relationships?.replied && (
        <div>
          {!allParentPostsLoaded ? (
            <Skeletons.Simple />
          ) : (
            parentURIs.map((parentURI, index) => {
              const reversedIndex = parentURIs.length - 1 - index;
              const post = parentPosts[parentURIs[reversedIndex]];
              const isLine = index > 0;

              if (!post?.post) {
                return (
                  <div key={parentURI} className="relative ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-lg w-[300px]">
                    <Typography.Body variant="small" className="text-opacity-50">
                      This post has been deleted by its author.
                    </Typography.Body>
                    <div className="absolute -ml-[1px] mt-1.5 border-l-[1px] border-[#444447] h-[50px]" />
                  </div>
                );
              }

              return (
                <div key={parentURI} className="mb-3 relative">
                  <PostComponent post={post.post} size="full" homeView largeView={!isMobileParent} line={isLine} />
                  {index < parentURIs.length - 1 && (
                    <div className="absolute left-[10px] bottom-[-24px] border-l-[1px] border-[#444447] h-[24px]" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Current Post Display */}
      <div ref={postRef} key={postData?.details?.uri} className="relative">
        {isArticle ? (
          <ArticlePost data={postData} />
        ) : (
          <StandardPost data={postData} hasParent={!!postData?.relationships?.replied} />
        )}
      </div>

      {/* Reply Section and Participants */}
      <div className="mt-6">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="col-span-2">
            {/* Create Reply Form */}
            <CreateContent
              id="reply-create-content"
              handleSubmit={handleReply}
              content={contentReply}
              setContent={setContentReply}
              setTextArea={setTextArea}
              placeHolder={placeholder}
              setQuote={setQuote}
              isValidContent={isValidContent}
              setIsValidContent={setIsValidContent}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              loading={sendingReply}
              arrayTags={arrayTags}
              setArrayTags={setArrayTags}
              button={
                <Button.Medium
                  id="reply-btn"
                  className="w-auto"
                  variant="line"
                  icon={
                    <Icon.ChatCircleText color={!isValidContent && selectedFiles.length === 0 ? 'gray' : 'white'} />
                  }
                  disabled={!isValidContent && selectedFiles.length === 0}
                  loading={sendingReply}
                  onClick={
                    (isValidContent || selectedFiles.length > 0) && !sendingReply
                      ? () => handleReply(contentReply)
                      : undefined
                  }
                >
                  Reply
                </Button.Medium>
              }
              textArea={textArea}
            />

            {/* Replies List */}
            <div className="mt-3 flex flex-col gap-3">
              {repliesLocal
                .filter((reply) => !mutedUsers.includes(reply.details.author))
                .filter((reply) => !deletedPosts.includes(reply.details.id))
                .map((reply, index) => (
                  <div key={`reply-${reply.details.author}-${reply.details.id}-${index}`}>
                    <PostComponent post={reply} size="full" className="w-full" />
                  </div>
                ))}

              {/* Loading indicator for more replies */}
              {repliesLoading && <Skeletons.Simple />}

              {/* Load more trigger */}
              {hasMore && !repliesLoading && <div ref={loaderRef} className="h-10" />}

              {/* No replies message */}
              {!repliesLoading && repliesLocal.length === 0 && (
                <div className="text-center py-8">
                  <Typography.Body variant="medium" className="text-opacity-50">
                    No replies yet. Be the first to reply!
                  </Typography.Body>
                </div>
              )}
            </div>
          </div>

          {/* Participants Panel */}
          <div className="hidden flex-col gap-6 xl:inline-flex col-span-1 self-start sticky top-[120px]">
            <div>
              <SideCard.Header title="Participants" />
              <SideCard.Content>
                {/* Author Card */}
                {postData && (
                  <AuthorCard
                    postData={postData}
                    userData={userData}
                    pubky={pubky}
                    loadingParticipants={loadingParticipants}
                    follow={follow}
                    unfollow={unfollow}
                  />
                )}

                {/* Participants Cards */}
                <ParticipantsList
                  participants={participants}
                  postAuthor={postData?.details?.author}
                  pubky={pubky}
                  mutedUsers={mutedUsers}
                  loadingParticipants={loadingParticipants}
                  follow={follow}
                  unfollow={unfollow}
                />
              </SideCard.Content>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components

const StandardPost = ({ data, hasParent }) => {
  const isMobile = useIsMobile();
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-[52%] -top-3 border-[#444447]`;

  return (
    <div className="flex items-center relative">
      {hasParent && (
        <>
          <div className={lineBaseCSS} />
          <div className="absolute ml-[10px]">
            <Icon.LineHorizontal size="14" color="#444447" />
          </div>
        </>
      )}
      <PostComponent
        key={data?.details?.uri}
        post={data}
        size="full"
        fullContent
        largeView={!isMobile}
        className={hasParent ? 'ml-6' : ''}
      />
    </div>
  );
};

const ArticlePost = ({ data }) => {
  const isMobile = useIsMobile();
  const { pubky } = usePubkyClientContext();
  const user = useUserProfile(data?.details?.author, pubky ?? '');

  let title = '';
  let body = '';

  try {
    const parsedContent = JSON.parse(data?.details?.content || '{}');
    title = parsedContent.title || '';
    body = parsedContent.body || '';
  } catch (error) {
    console.error('Error parsing content JSON:', error);
    title = 'Error loading content';
    body = 'The content of this post could not be processed. The format may be incorrect.';
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-auto lg:w-[1200px] flex flex-col gap-4">
        <Typography.Display className="sm:leading-[64px] break-all">{title}</Typography.Display>
        <div className="flex w-full gap-4 justify-between items-center">
          <div className="justify-start gap-3 flex items-center mt-4 mb-2">
            <ImageByUri
              id={user?.data?.details.id}
              width={48}
              height={48}
              className="w-[32px] h-[32px] md:w-[48px] md:h-[48px] rounded-full"
              alt="user-image"
              uri={user?.data?.details?.image}
            />
            <Link
              className="cursor-pointer flex flex-col md:flex-row md:gap-4 md:items-center"
              href={`/profile/${data?.details?.author}`}
            >
              <Typography.Body className={`text-2xl hover:underline hover:decoration-solid`} variant="medium-bold">
                {Utils.minifyText(user?.data?.details?.name ?? Utils.minifyPubky(data?.details?.author), 24)}
              </Typography.Body>
              <div className="flex gap-1 -mt-1 md:mt-1 cursor-pointer">
                <Typography.Label className="text-opacity-30">
                  {Utils.minifyPubky(data?.details?.author ?? '')}
                </Typography.Label>
              </div>
            </Link>
          </div>
          <PostUI.Time className="mr-2">{Utils.timeAgo(data?.details?.indexed_at, isMobile)}</PostUI.Time>
        </div>
        {data?.details?.attachments && data?.details?.attachments[0] && (
          <ImageByUri
            width={1200}
            height={650}
            className="w-[1200px] h-auto rounded-lg mb-4"
            alt="article-image"
            uri={data?.details?.attachments[0] ?? ''}
            loading
          />
        )}
        <div
          className="text-white break-words"
          dangerouslySetInnerHTML={{
            __html: body
          }}
        ></div>
      </div>
      <SimplePostTags.PostLargeView post={data} />
    </div>
  );
};

const AuthorCard = ({ postData, userData, pubky, loadingParticipants, follow, unfollow }) => (
  <SideCard.User
    key={`author-${postData.details.author}`}
    uri={postData.details.author}
    uriImage={userData?.details?.image || '/images/webp/Userpic.webp'}
    username={Utils.minifyText(userData?.details?.name ?? '')}
    label={Utils.minifyPubky(postData.details.author ?? '')}
    className="mb-2"
  >
    {pubky === postData.details.author ? (
      <Button.Medium className="w-[114px] bg-transparent cursor-default" icon={<Icon.User size="16" />}>
        Me
      </Button.Medium>
    ) : (
      <Button.Medium
        onClick={() =>
          userData?.relationship?.following ? unfollow(postData.details.author) : follow(postData.details.author)
        }
        disabled={loadingParticipants}
        loading={loadingParticipants}
        icon={userData?.relationship?.following ? <Icon.UserMinus size="16" /> : <Icon.UserPlus size="16" />}
        className="w-[114px]"
      >
        {userData?.relationship?.following ? 'Unfollow' : 'Follow'}
      </Button.Medium>
    )}
  </SideCard.User>
);

const ParticipantCard = ({ participant, pubky, loadingParticipants, follow, unfollow }) => {
  const { data: participantData } = useUserProfile(participant.id, pubky ?? '');
  if (!participantData) return null;

  return (
    <SideCard.User
      key={`participant-${participant.id}`}
      uri={participant.id}
      uriImage={participantData?.details?.image || '/images/webp/Userpic.webp'}
      username={Utils.minifyText(participantData?.details?.name)}
      label={Utils.minifyPubky(participant.id)}
      className="mb-2"
    >
      {pubky === participant.id ? (
        <Button.Medium className="w-[114px] bg-transparent cursor-default" icon={<Icon.User size="16" />}>
          Me
        </Button.Medium>
      ) : (
        <Button.Medium
          onClick={() => (participantData?.relationship?.following ? unfollow(participant.id) : follow(participant.id))}
          disabled={loadingParticipants}
          loading={loadingParticipants}
          icon={participantData?.relationship?.following ? <Icon.UserMinus size="16" /> : <Icon.UserPlus size="16" />}
          className="w-[114px]"
        >
          {participantData?.relationship?.following ? 'Unfollow' : 'Follow'}
        </Button.Medium>
      )}
    </SideCard.User>
  );
};

const ParticipantsList = ({ participants, postAuthor, pubky, mutedUsers, loadingParticipants, follow, unfollow }) => {
  // Convert participants array to objects with stable IDs
  const participantObjects = participants
    .filter((participantId) => participantId !== postAuthor)
    .filter((participantId) => !mutedUsers?.includes(participantId))
    .map((participantId) => ({ id: participantId }));

  return (
    <>
      {participantObjects.map((participant) => (
        <ParticipantCard
          key={participant.id}
          participant={participant}
          pubky={pubky}
          loadingParticipants={loadingParticipants}
          follow={follow}
          unfollow={unfollow}
        />
      ))}
    </>
  );
};

export default PostPage;
