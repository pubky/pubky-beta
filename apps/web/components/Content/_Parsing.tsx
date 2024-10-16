import React from 'react';
import LinkParser from 'react-link-parser';
import ProfileLink from '../Post/_ProfileLink';
import { Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';

interface ParsingProps {
  children: string;
  fullContent?: boolean;
}

const tagsIcons: { [key: string]: JSX.Element } = {
  '#synonym': <Icon.Synonym size="24" />,
  '#slashtags': <Icon.Slashtags size="24" />,
  '#blocktank': <Icon.Blocktank size="24" />,
  '#bitkit': <Icon.Bitkit size="24" />,
  '#bitcoin': <Icon.Bitcoin size="24" />,
  '#tether': <Icon.Tether size="24" />,
};

const Parsing = ({ children, fullContent = false }: ParsingProps) => {
  const watchers = [
    {
      type: 'startsWith',
      watchFor: 'pk:',
      render: (pk: string) => <ProfileLink pk={pk} />,
    },
    {
      type: 'startsWith',
      watchFor: '#',
      render: (tag: string) => {
        const trimmedTag = tag.trim().toLowerCase();
        const icon = tagsIcons[trimmedTag];
        return (
          <a
            className="text-[#C8FF00] break-all inline-flex mr-1"
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
            className="text-[#C8FF00] break-all"
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
          className="text-[#C8FF00] break-all"
          href={`mailto:${url.trim()}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {url}
        </a>
      ),
    },
  ];

  const cleanText = (text: string) => {
    return text.replace(/\n{3,}/g, '\n\n');
  };

  const cleanedText = cleanText(children.toString());
  const minifiedContent = Utils.minifyContent(cleanedText, 10);
  const contentText = fullContent ? cleanedText : minifiedContent;
  const lines = contentText.split('\n');

  return (
    <>
      {lines.map((line, index) => (
        <span key={index}>
          <LinkParser watchers={watchers as []}>{line}</LinkParser>
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
};

export default Parsing;
