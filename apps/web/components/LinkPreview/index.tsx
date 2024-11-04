'use client';

import { useEffect, useState } from 'react';
import getYouTubeID from 'get-youtube-id';
import { Tweet } from 'react-tweet';
import { Preview, Post } from '@social/ui-shared';
import { Spotify } from 'react-spotify-embed';

interface LinkPreviewerProps {
  content: string;
}

export default function LinkPreviewer({ content }: LinkPreviewerProps) {
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const checkForLink = (text: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    try {
      const timeout = setTimeout(() => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = text.match(urlRegex);
        if (urls) {
          const url = urls[0];
          setPreview(url);

          const youtubeId = getYouTubeID(url);
          if (youtubeId) {
            setVideoId(youtubeId);
          } else {
            setVideoId('');
          }

          const twitterRegex =
            /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
          const twitterMatch = url.match(twitterRegex);
          if (twitterMatch) {
            const tweetId = twitterMatch[3];
            setTweetId(tweetId);
          } else {
            setTweetId('');
          }
          const githubRegex = /https:\/\/github\.com\/[^/]+\/[^/]+/;
          const githubMatch = url.match(githubRegex);
          if (githubMatch) {
            setGithubUrl(githubMatch[0]);
          } else {
            setGithubUrl('');
          }
          const spotifyRegex = /https:\/\/open\.spotify\.com\/track\/\w+/;
          if (spotifyRegex.test(url)) {
            setSpotifyUrl(url);
          } else {
            setSpotifyUrl('');
          }
        } else {
          setPreview('');
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
          <Post.LinkPreview url={preview} />
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
