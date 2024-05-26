'use client';

import React, { useEffect, useState } from 'react';
import LinkParser from 'react-link-parser';
import { Tweet } from 'react-tweet';
import LinkPreview from './_Preview';
import getYouTubeID from 'get-youtube-id';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  children?: React.ReactNode;
}

export const Content = ({ children, text }: ContentProps) => {
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');

  function checkForLink(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const url = text.match(urlRegex);
    if (url) {
      setPreview(url[0]);

      const youtubeId = getYouTubeID(text);
      if (youtubeId) {
        setVideoId(youtubeId);
      }

      const twitterRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/;
      const twitterMatch = text.match(twitterRegex);
      if (twitterMatch) {
        const tweetId = twitterMatch[3];
        setTweetId(tweetId);
      }
    }
  }

  useEffect(() => {
    const splitInLines = text.split(' ');
    if (splitInLines.length >= 1) {
      splitInLines.forEach((line) => {
        checkForLink(line.trim());
      });
    }
  }, [text]);

  const watchers = [
    {
      type: 'startsWith',
      watchFor: 'pk:',
      render: (pk: string) => (
        <a
          className="text-fuchsia-500 break-all"
          href={`/profile/${pk.replace('pk:', '')}`}
        >
          {pk}
        </a>
      ),
    },
    {
      type: 'startsWith',
      watchFor: '#',
      render: (tag: string) => (
        <a
          className="text-fuchsia-500 break-all"
          href={`search?tags=${tag.replace('#', '')}`}
        >
          {tag}
        </a>
      ),
    },
    {
      watchFor: 'link',
      render: (url: string) => {
        return (
          <a
            className="text-fuchsia-500 break-all"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {url}
          </a>
        );
      },
    },
    {
      watchFor: 'email',
      render: (url: string) => (
        <a
          className="text-fuchsia-500 break-all"
          href={`mailto:${url}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {url.replace('@', '[at]')}
        </a>
      ),
    },
  ];

  return (
    <div className="text-white">
      <LinkParser
        watchers={watchers as []}
        parseNewLine={true}
        newLineWatcher={`\\n`}
      >
        {text}
      </LinkParser>
      {videoId && (
        <div className="relative border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden">
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
      {preview && !videoId && !tweetId && <LinkPreview url={preview} />}
      {tweetId && (
        <div className="flex overflow-hidden justify-center">
          <Tweet id={tweetId} />
        </div>
      )}
      {children}
    </div>
  );
};
