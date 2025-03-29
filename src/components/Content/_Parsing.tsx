import React, { useState } from 'react';
import LinkParser from 'react-link-parser';
import ProfileLink from '../Post/_ProfileLink';
import { Icon, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ParsingProps {
  children: string;
  fullContent?: boolean;
  largeView?: boolean;
  repostView?: boolean;
}

const tagsIcons: { [key: string]: JSX.Element } = {
  '#synonym': <Icon.Synonym size="24" />,
  '#blocktank': <Icon.Blocktank size="24" />,
  '#bitkit': <Icon.Bitkit size="24" />,
  '#bitcoin': <Icon.Bitcoin size="24" />,
  '#tether': <Icon.Tether size="24" />,
  '#pubky': <Icon.PubkyIcon size="22" />
};

const Parsing = ({ children, fullContent = false, largeView, repostView }: ParsingProps) => {
  const [copy, setCopy] = useState(false);

  const highlightInlineCode = (text: string): JSX.Element[] => {
    const parts = text.split(/(`[^`]*`)/g);
    return parts.map((part, index) =>
      part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
        <span key={index} className="border border-white/10 px-1.5 py-0.5 rounded bg-[#2A2D30] text-[#E8902C]">
          <LinkParser watchers={watchers as []}>{part.slice(1, -1)}</LinkParser>
        </span>
      ) : (
        <span key={index}>
          <LinkParser watchers={watchers as []}>{part}</LinkParser>
        </span>
      )
    );
  };

  const highlightBoldText = (text: string): JSX.Element[] => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
        <strong key={index} className="font-bold">
          <LinkParser watchers={watchers as []}>{part.slice(2, -2)}</LinkParser>
        </strong>
      ) : (
        <span key={index}>
          <LinkParser watchers={watchers as []}>{part}</LinkParser>
        </span>
      )
    );
  };

  const watchers = [
    {
      type: 'startsWith' as const,
      watchFor: 'pk:',
      render: (pk: string) => <ProfileLink pk={pk} />
    },
    {
      type: 'startsWith' as const,
      watchFor: '#',
      render: (tag: string) => {
        const trimmedTag = tag.trim().toLowerCase();
        const icon = tagsIcons[trimmedTag];
        return (
          <Link
            className="text-[#C8FF00] break-all inline-flex mr-1"
            href={`/search?tags=${tag.replace('#', '').trim()}`}
            target="_self"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            {tag} {icon && <span className="ml-1">{icon}</span>}
          </Link>
        );
      }
    },
    {
      type: 'startsWith' as const,
      watchFor: 'http',
      render: (url: string) => {
        // Clean up the URL by removing any whitespace and ensuring proper format
        const cleanUrl = url.trim();
        const fullUrl =
          cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') ? cleanUrl : `https://${cleanUrl}`;

        const isValidUrl = (value: string) => {
          try {
            const parsedUrl = new URL(value);
            return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
          } catch {
            return false;
          }
        };

        if (!isValidUrl(fullUrl)) return url;

        return (
          <Link
            className="text-[#C8FF00] break-all"
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            {cleanUrl}
          </Link>
        );
      }
    },
    {
      type: 'startsWith' as const,
      watchFor: 'mailto:',
      render: (url: string) => {
        const email = url.replace('mailto:', '');
        const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

        if (!isValidEmail(email)) return url;
        return (
          <Link
            className="text-[#C8FF00] break-all"
            href={`mailto:${email.trim()}`}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(event) => event.stopPropagation()}
          >
            {email}
          </Link>
        );
      }
    }
  ];

  const cleanText = (text: string) => text.replace(/\n{3,}/g, '\n\n');
  const cleanedText = cleanText(children.toString());
  const contentText = fullContent ? cleanedText : Utils.minifyContent(cleanedText, 10);
  const lines = contentText.split('\n');

  const renderCodeBlock = (codeContent: string, key: string) => {
    if (!codeContent.trim()) return null;
    return (
      <div
        key={key}
        className={`w-auto max-w-[300px] sm:max-w-[520px] md:max-w-[640px] lg:max-w-[600px] ${repostView ? 'xl:max-w-[690px]' : 'xl:max-w-[720px]'}`}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-[#3a404d] flex justify-between px-4 py-1 items-center rounded-t-md"
        >
          <Typography.Body variant="small-bold" className="text-opacity-80">
            code
          </Typography.Body>
          <div
            className="flex gap-1 items-center opacity-80 hover:opacity-100"
            onClick={async () => {
              if (!copy) {
                try {
                  await navigator.clipboard.writeText(codeContent);
                  setCopy(true);
                  setTimeout(() => setCopy(false), 1000);
                } catch (error) {
                  console.error('Failed to copy text to clipboard:', error);
                }
              }
            }}
          >
            {copy ? <Icon.Check size="16" /> : <Icon.Clipboard size="16" />}
            <Typography.Body variant="small-bold">{copy ? 'Copied!' : 'Copy'}</Typography.Body>
          </div>
        </div>
        <SyntaxHighlighter
          language="typescript"
          style={dracula}
          wrapLongLines
          className="scrollbar-thin scrollbar-webkit"
          customStyle={{
            margin: '0px',
            borderRadius: '0px'
          }}
        >
          {codeContent}
        </SyntaxHighlighter>
      </div>
    );
  };

  const renderContent = () => {
    const cssText = largeView ? 'text-2xl leading-[30px]' : 'text-[17px] leading-snug';
    const elements: JSX.Element[] = [];
    let isCodeBlock = false;
    let codeLines: string[] = [];

    lines.forEach((line, index) => {
      if (line.trim() === '```') {
        if (isCodeBlock) {
          elements.push(renderCodeBlock(codeLines.join('\n'), `code-${index}`) || <></>);
          codeLines = [];
          isCodeBlock = false;
        } else {
          isCodeBlock = true;
        }
      } else if (isCodeBlock) {
        codeLines.push(line);
      } else {
        elements.push(
          <span key={index} className={`${cssText} opacity-90 font-normal tracking-wide`}>
            {line.includes('**') ? (
              highlightBoldText(line)
            ) : line.includes('`') ? (
              highlightInlineCode(line)
            ) : (
              <LinkParser watchers={watchers}>{line}</LinkParser>
            )}
            {index < lines.length - 1 && <br />}
          </span>
        );
      }
    });

    if (isCodeBlock) {
      const renderedBlock = renderCodeBlock(codeLines.join('\n'), 'code-unclosed');
      if (renderedBlock) elements.push(renderedBlock);
    }

    return elements;
  };

  return <>{renderContent()}</>;
};

export default Parsing;
