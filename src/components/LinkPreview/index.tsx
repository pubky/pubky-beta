'use client';

import { useEffect, useState } from 'react';
import getYouTubeID from 'get-youtube-id';
import { Tweet } from 'react-tweet';
import { Preview, Post as PostUI } from '@social/ui-shared';
import { Spotify } from 'react-spotify-embed';
import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { getPost } from '@/services/postService';
import { Post } from '@/components';

interface LinkPreviewerProps {
  content: string;
  setQuote?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function LinkPreviewer({ content, setQuote }: LinkPreviewerProps) {
  const { pubky } = usePubkyClientContext();
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [postPreview, setPostPreview] = useState<PostView>();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const checkForLink = (text: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    try {
      const timeout = setTimeout(async () => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = text.match(urlRegex);
        if (urls) {
          const url = urls[0];

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

            setPreview('');
            return;
          }

          setPreview(url);

          const youtubeId = getYouTubeID(url);
          setVideoId(youtubeId || '');

          const twitterRegex = /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
          const twitterMatch = url.match(twitterRegex);
          setTweetId(twitterMatch ? twitterMatch[3] : '');

          const githubRegex = /https:\/\/github\.com\/[^/]+\/[^/]+/;
          const githubMatch = url.match(githubRegex);
          setGithubUrl(githubMatch ? githubMatch[0] : '');

          const spotifyRegex = /https:\/\/open\.spotify\.com\/track\/\w+/;
          setSpotifyUrl(spotifyRegex.test(url) ? url : '');
        } else {
          setPreview('');
          setPostPreview(undefined);
          setVideoId('');
          setTweetId('');
          setGithubUrl('');
          setSpotifyUrl('');
        }
      }, 100);

      setDebounceTimeout(timeout);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkForLink(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <>
      {postPreview && (
        <div className="w-full mb-4">
          <Post post={postPreview} repostView />
        </div>
      )}
      {videoId && (
        <div className="relative w-full border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {preview && !videoId && !tweetId && !githubUrl && !spotifyUrl && (
        <div className="flex w-full overflow-hidden justify-start -mt-2 -mb-6">
          <PostUI.LinkPreview url={preview} />
        </div>
      )}
      {tweetId && (
        <div className="flex w-full overflow-hidden justify-start -mt-2 -mb-6">
          <Tweet id={tweetId} />
        </div>
      )}
      {githubUrl && <Preview.GitHub url={githubUrl} />}
      {spotifyUrl && <Spotify link={spotifyUrl} />}
    </>
  );
}
