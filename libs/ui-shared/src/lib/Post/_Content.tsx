'use client';

import React, { useEffect, useState } from 'react';
import LinkParser from 'react-link-parser';
import { Utils } from '@social/utils-shared';
import { Tweet } from 'react-tweet';
import LinkPreview from './_Preview';
import { GitHub } from '../Preview/Github';
import getYouTubeID from 'get-youtube-id';
import { Icon } from '../Icon';
import { useClientContext } from '../../../../../apps/web/contexts/';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string | JSX.Element;
  uri?: string;
  children?: React.ReactNode;
  fullContent?: boolean;
  largeView?: boolean;
}

const tagsIcons: { [key: string]: JSX.Element } = {
  '#synonym': <Icon.Synonym size="24" />,
  '#slashtags': <Icon.Slashtags size="24" />,
  '#blocktank': <Icon.Blocktank size="24" />,
  '#bitkit': <Icon.Bitkit size="24" />,
  '#bitcoin': <Icon.Bitcoin size="24" />,
  '#tether': <Icon.Tether size="24" />,
};

export const Content = ({
  children,
  uri = '',
  text,
  fullContent = false,
  largeView = false,
}: ContentProps) => {
  const { getUserIndexed } = useClientContext();
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  function checkForLink(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    if (urls) {
      const url = urls[0];
      setPreview(url);

      const youtubeId = getYouTubeID(url);
      if (youtubeId) {
        setVideoId(youtubeId);
      }

      const twitterRegex =
        /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
      const twitterMatch = url.match(twitterRegex);
      if (twitterMatch) {
        const tweetId = twitterMatch[3];
        setTweetId(tweetId);
      }

      const githubRegex = /https:\/\/github\.com\/[^/]+\/[^/]+/;
      const githubMatch = url.match(githubRegex);
      if (githubMatch) {
        setGithubUrl(githubMatch[0]);
      }
    }
  }

  const cleanText = (text: string) => {
    return text.replace(/\n{3,}/g, '\n\n');
  };

  useEffect(() => {
    const cleanedText = cleanText(text.toString());
    const splitInLines = cleanedText.split(' ');
    if (splitInLines.length >= 1) {
      splitInLines.forEach((line: string) => {
        checkForLink(line.trim());
      });
    }
  }, [text]);

  const watchers = [
    {
      type: 'startsWith',
      watchFor: 'pk:',
      render: (pk: string) => {
        const [userName, setUserName] = useState<string | null>(null);

        useEffect(() => {
          const fetchUser = async () => {
            const pkMatch = pk.match(/pk:[a-zA-Z0-9]{52}/);
            if (pkMatch) {
              const pkFound = pkMatch[0];
              const result = await getUserIndexed(
                pkFound.replace('pk:', '').trim()
              );
              if (result) setUserName(result?.profile?.name);
            }
          };
          fetchUser();
        }, [pk]);

        const pkMatch = pk.match(/pk:[a-zA-Z0-9]{52}/);
        const pkPart = pkMatch?.[0]?.replace('pk:', '').trim() || '';
        const remainingPart = pk.replace(pkMatch?.[0] || '', '').trim();

        return (
          <>
            <a
              className="text-fuchsia-500 break-all"
              href={`/profile/${pkPart}`}
            >
              {userName ? `@${userName}` : 'Loading...'}
            </a>
            {remainingPart}
          </>
        );
      },
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

  const cleanedText = cleanText(text.toString());
  const minifiedContent = Utils.minifyContent(cleanedText, 10);
  const contentText = fullContent ? cleanedText : minifiedContent;

  const lines = contentText.split('\n').map((line, index) => (
    <div key={index} className={`${largeView && 'text-2xl mt-4'} min-h-[10px]`}>
      <LinkParser watchers={watchers as []}>{line}</LinkParser>
    </div>
  ));

  const showMore = !fullContent && cleanedText !== minifiedContent;

  return (
    <div className="text-white break-words">
      {lines}
      {showMore && (
        <a
          href={Utils.encodePostUri(uri)}
          className="text-fuchsia-500 text-opacity-80 hover:text-opacity-100"
        >
          Show more
        </a>
      )}
      {videoId && (
        <div className="w-full max-w-[560px] relative border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden">
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
      {preview && !videoId && !tweetId && !githubUrl && (
        <LinkPreview url={preview} />
      )}
      {tweetId && (
        <div className="no-scrollbar max-h-[500px] w-full max-w-[384px] overflow-y-auto">
          <Tweet id={tweetId} />
        </div>
      )}
      {githubUrl && <GitHub url={githubUrl} />}
      {children}
    </div>
  );
};
