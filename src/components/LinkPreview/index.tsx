'use client';

import { useEffect, useMemo, useState } from 'react';
import { Tweet } from 'react-tweet';
import { Preview, Post as PostUI } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { getPost } from '@/services/postService';
import { Post } from '@/components';
import { PostThread } from 'react-bluesky-embed';
import { useInlineUrls } from '@/hooks/useInlineUrls';

interface LinkPreviewerProps {
  content: string;
  setQuote?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function LinkPreviewer({ content, setQuote }: LinkPreviewerProps) {
  const { pubky } = usePubkyClientContext();
  const [postPreview, setPostPreview] = useState<PostView>();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Use the useInlineUrls hook for URL detection
  const { preview, videoId, videoStart, tweetId, githubUrl, spotifyUrl, blueskyUrl } = useInlineUrls({ text: content });

  const checkForPubkyPost = (text: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    try {
      const timeout = setTimeout(async () => {
        // Find all URLs (both protocol and domain-only) with their positions
        const protocolRegex = /(https?:\/\/[^\s]+)/g;
        const domainRegex = /(?:www\.)?([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}(?:\/[^\s]*)*/g;

        const allUrls: Array<{ url: string; index: number }> = [];

        // Find protocol URLs
        for (const match of text.matchAll(protocolRegex)) {
          allUrls.push({ url: match[0], index: match.index! });
        }

        // Find domain-only URLs (skip those that are part of protocol URLs)
        for (const match of text.matchAll(domainRegex)) {
          const domain = match[0];
          const start = match.index!;

          // Check if this domain is part of a protocol URL
          const beforeDomain = text.slice(Math.max(0, start - 8), start);
          if (!beforeDomain.includes('http://') && !beforeDomain.includes('https://')) {
            allUrls.push({ url: `https://${domain}`, index: start });
          }
        }

        // Sort by position and take the first one
        let url = '';
        if (allUrls.length > 0) {
          const firstUrl = allUrls.sort((a, b) => a.index - b.index)[0];
          url = firstUrl.url;
        }

        if (url) {
          const postRegex = new RegExp(`/post/([^/]+)/([^/]+)`);
          const postMatch = url.match(postRegex);

          if (postMatch && setQuote) {
            const [_, creatorPubky, postId] = postMatch;

            try {
              const post = await getPost(creatorPubky, postId, pubky);

              if (post) {
                if (post?.details?.content === '' && post?.relationships?.reposted) {
                  const repostRegex = /pubky:\/\/([^/]+)\/pub\/pubky\.app\/posts\/([^/]+)/;
                  const repostMatch = post.relationships.reposted.match(repostRegex);

                  if (repostMatch) {
                    const [__, creatorPubkyRepost, repostId] = repostMatch;
                    const repost = await getPost(creatorPubkyRepost, repostId, pubky);

                    setPostPreview(repost);
                    setQuote(`pubky://${creatorPubkyRepost}/pub/pubky.app/posts/${repostId}`);
                    return;
                  }
                }
                setPostPreview(post);
                setQuote(`pubky://${creatorPubky}/pub/pubky.app/posts/${postId}`);
              } else {
                setPostPreview(undefined);
              }
            } catch (error) {
              console.error('Failed to fetch post:', error);
              setPostPreview(undefined);
            }
          }
        } else {
          setPostPreview(undefined);
          setQuote?.(undefined);
        }
      }, 100);

      setDebounceTimeout(timeout);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkForPubkyPost(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const youtubeEmbedSrc = useMemo(() => {
    if (!videoId) {
      return '';
    }

    const params = new URLSearchParams({ enablejsapi: '1' });
    if (videoStart > 0) {
      params.set('start', videoStart.toString());
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, videoStart]);

  return (
    <>
      {postPreview && (
        <div className="w-full mb-4">
          <Post post={postPreview} repostView postType="single" />
        </div>
      )}
      {videoId && youtubeEmbedSrc && (
        <div className="relative w-full border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden">
          <iframe
            width="100%"
            height="315"
            src={youtubeEmbedSrc}
            title="YouTube video player"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {preview && !videoId && !tweetId && !githubUrl && !spotifyUrl && !blueskyUrl.url && (
        <div className="flex w-full overflow-hidden justify-start -mt-2">
          <PostUI.LinkPreview url={preview} />
        </div>
      )}
      {tweetId && (
        <div className="flex w-full overflow-hidden justify-start -mt-2 -mb-6">
          <Tweet id={tweetId} />
        </div>
      )}
      {githubUrl && <Preview.GitHub url={githubUrl} />}
      {blueskyUrl.url && blueskyUrl.did && blueskyUrl.rkey && (
        <div className="no-scrollbar w-full max-w-[300px] sm:max-w-[480px] overflow-y-auto">
          <PostThread
            params={{
              did: blueskyUrl.did,
              rkey: blueskyUrl.rkey
            }}
          />
        </div>
      )}
    </>
  );
}
