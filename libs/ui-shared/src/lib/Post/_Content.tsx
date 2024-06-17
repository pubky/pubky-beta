'use client';

import React, { useEffect, useState } from 'react';
import LinkParser from 'react-link-parser';
import { Tweet } from 'react-tweet';
import LinkPreview from './_Preview';
import getYouTubeID from 'get-youtube-id';
import { Icon } from '../Icon';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  children?: React.ReactNode;
}

const tagsIcons: { [key: string]: JSX.Element } = {
  '#synonym': <Icon.Synonym size="24" />,
  '#slashtags': <Icon.Slashtags size="24" />,
  '#blocktank': <Icon.Blocktank size="24" />,
  '#bitkit': <Icon.Bitkit size="24" />,
  '#bitcoin': <Icon.Bitcoin size="24" />,
  '#tether': <Icon.Tether size="24" />,
};

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
      render: (tag: string) => {
        const trimmedTag = tag.trim().toLowerCase();
        const icon = tagsIcons[trimmedTag];
        return (
          <a
            className="text-fuchsia-500 break-all inline-flex mr-1"
            href={`/search?tags=${tag.replace('#', '').trim()}`}
            target="_self"
            rel="noreferrer"
          >
            {tag} {icon && <span className="ml-1">{icon}</span>}
          </a>
        );
      },
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
          href={`mailto:${url.trim()}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {url}
        </a>
      ),
    },
  ];

  const lines = text
    .slice(0, 300)
    .split('\n')
    .map((line, index) => (
      <div key={index} className="min-h-[10px]">
        <LinkParser watchers={watchers as []}>{line}</LinkParser>
      </div>
    ));

  return (
    <div className="text-white break-words">
      {lines}
      {text.length > 300 && '...'}
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
        <div className="flex overflow-hidden justify-start -mt-2 -mb-6">
          <Tweet id={tweetId} />
        </div>
      )}
      {children}
    </div>
  );
};
