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

interface TagIcon {
  [key: string]: JSX.Element;
}

const PK_PATTERNS = {
  SPACE_BEFORE: /\s+pk:[a-zA-Z0-9]{52}/,
  SPACE_AFTER: /pk:[a-zA-Z0-9]{52}\s+/,
  BASE: /pk:[a-zA-Z0-9]{52}/
};

const tagsIcons: TagIcon = {
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

  const highlightItalicText = (text: string): JSX.Element[] => {
    const parts = text.split(/(_[^_]+_)/g);
    return parts.map((part, index) =>
      part.startsWith('_') && part.endsWith('_') && part.length > 2 ? (
        <em key={index} className="italic">
          <LinkParser watchers={watchers as []}>{part.slice(1, -1)}</LinkParser>
        </em>
      ) : (
        <span key={index}>
          <LinkParser watchers={watchers as []}>{part}</LinkParser>
        </span>
      )
    );
  };

  const highlightUnderlinedText = (text: string): JSX.Element[] => {
    const parts = text.split(/(__[^_]+__)/g);
    return parts.map((part, index) =>
      part.startsWith('__') && part.endsWith('__') && part.length > 4 ? (
        <span key={index} className="underline">
          <LinkParser watchers={watchers as []}>{part.slice(2, -2)}</LinkParser>
        </span>
      ) : (
        <span key={index}>
          <LinkParser watchers={watchers as []}>{part}</LinkParser>
        </span>
      )
    );
  };

  const highlightStrikethroughText = (text: string): JSX.Element[] => {
    const parts = text.split(/(~~[^~]+~~)/g);
    return parts.map((part, index) =>
      part.startsWith('~~') && part.endsWith('~~') && part.length > 4 ? (
        <span key={index} className="line-through">
          <LinkParser watchers={watchers as []}>{part.slice(2, -2)}</LinkParser>
        </span>
      ) : (
        <span key={index}>
          <LinkParser watchers={watchers as []}>{part}</LinkParser>
        </span>
      )
    );
  };

  const isValidUrl = (url: string): boolean => {
    try {
      // Remove trailing punctuation marks
      const cleanUrl = url.replace(/[.,;:!?]+$/, '');
      const parsedUrl = new URL(cleanUrl);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const watchers = [
    {
      type: 'startsWith' as const,
      watchFor: 'pk:',
      render: (pk: string) => {
        const pkMatch = pk.match(PK_PATTERNS.BASE);
        return pkMatch ? <ProfileLink pk={pkMatch[0]} /> : pk;
      }
    },
    {
      type: 'startsWith' as const,
      watchFor: '#',
      render: (tag: string) => {
        const trimmedTag = tag.trim().toLowerCase();
        const icon = tagsIcons[trimmedTag];
        return (
          <Link
            className="text-[#C8FF00] break-words inline-flex mr-1"
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
        const cleanUrl = url.trim();
        // Remove trailing punctuation marks
        const urlWithoutPunctuation = cleanUrl.replace(/[.,;:!?]+$/, '');
        const fullUrl =
          urlWithoutPunctuation.startsWith('http://') || urlWithoutPunctuation.startsWith('https://')
            ? urlWithoutPunctuation
            : `https://${urlWithoutPunctuation}`;

        if (!isValidUrl(fullUrl)) return url;

        // Get the punctuation that was removed (if any)
        const punctuation = cleanUrl.slice(urlWithoutPunctuation.length);

        return (
          <>
            <Link
              className="text-[#C8FF00] break-words"
              href={fullUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              {urlWithoutPunctuation}
            </Link>
            {punctuation}
          </>
        );
      }
    },
    {
      type: 'startsWith' as const,
      watchFor: 'mailto:',
      render: (url: string) => {
        const email = url.replace('mailto:', '');
        if (!isValidEmail(email)) return url;

        return (
          <Link
            className="text-[#C8FF00] break-words mr-1"
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

  const cleanText = (text: string): string => text.replace(/\n{3,}/g, '\n\n');
  const cleanedText = cleanText(children.toString());
  const contentText = fullContent ? cleanedText : Utils.minifyContent(cleanedText, 7, 500);
  const lines = contentText.split('\n');

  const handleCopy = async (codeContent: string) => {
    if (!copy) {
      try {
        await navigator.clipboard.writeText(codeContent);
        setCopy(true);
        setTimeout(() => setCopy(false), 1000);
      } catch (error) {
        console.error('Failed to copy text to clipboard:', error);
      }
    }
  };

  const renderCodeBlock = (codeContent: string, key: string) => {
    if (!codeContent.trim()) return null;

    return (
      <div
        key={key}
        className={`w-auto max-w-[300px] sm:max-w-[520px] md:max-w-[640px] lg:max-w-[600px] ${
          repostView ? 'xl:max-w-[690px]' : 'xl:max-w-[720px]'
        }`}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-[#3a404d] flex justify-between px-4 py-1 items-center rounded-t-md"
        >
          <Typography.Body variant="small-bold" className="text-opacity-80">
            code
          </Typography.Body>
          <div className="flex gap-1 items-center opacity-80 hover:opacity-100" onClick={() => handleCopy(codeContent)}>
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

  const renderPkLink = (part: string, partIndex: number) => {
    const pkMatch = part.match(PK_PATTERNS.BASE);
    if (!pkMatch) return null;

    const pk = pkMatch[0];
    const beforePk = part.slice(0, part.indexOf(pk));
    const afterPk = part.slice(part.indexOf(pk) + pk.length);

    return (
      <React.Fragment key={`pk-link-${partIndex}`}>
        {beforePk && <span key={`before-${partIndex}`}>{beforePk}</span>}
        <ProfileLink key={`pk-${partIndex}`} pk={pk} />
        {afterPk && <span key={`after-${partIndex}`}>{afterPk}</span>}
      </React.Fragment>
    );
  };

  const renderQuote = (text: string, level: number = 1): JSX.Element => {
    // Line style
    const lineColor = '#dddddd';
    const lineWidth = 3;
    const lineGap = 8;
    const totalLineWidth = level * lineWidth + (level - 1) * lineGap;

    return (
      <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: `${totalLineWidth}px`,
            minWidth: `${totalLineWidth}px`,
            marginRight: '12px',
            alignSelf: 'stretch'
          }}
        >
          {Array.from({ length: level }).map((_, i) => (
            <div
              key={i}
              style={{
                width: `${lineWidth}px`,
                minWidth: `${lineWidth}px`,
                alignSelf: 'stretch',
                minHeight: '1.5em',
                background: lineColor,
                marginRight: i < level - 1 ? `${lineGap}px` : 0
              }}
            />
          ))}
        </div>
        <div style={{ flex: 1 }}>{text}</div>
      </div>
    );
  };

  const processQuotes = (line: string): JSX.Element | null => {
    const quoteMatch = line.match(/^(>{1,2})\s*(.+)$/);
    if (!quoteMatch) return null;

    const level = quoteMatch[1].length;
    const content = quoteMatch[2];

    return renderQuote(content, level);
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
        const quoteElement = processQuotes(line);
        if (quoteElement) {
          elements.push(quoteElement);
        } else {
          const parts = line.split(
            new RegExp(
              `(${PK_PATTERNS.SPACE_BEFORE.source}|${PK_PATTERNS.SPACE_AFTER.source}|${PK_PATTERNS.BASE.source})`
            )
          );
          const processedParts = parts
            .map((part, partIndex) => {
              if (!part) return null;

              const pkLink = renderPkLink(part, partIndex);
              if (pkLink) return pkLink;
              return (
                <span key={`text-${partIndex}`}>
                  {part.includes('**') ? (
                    highlightBoldText(part)
                  ) : part.includes('__') ? (
                    highlightUnderlinedText(part)
                  ) : part.includes('~~') ? (
                    highlightStrikethroughText(part)
                  ) : part.includes('_') ? (
                    highlightItalicText(part)
                  ) : part.includes('`') ? (
                    highlightInlineCode(part)
                  ) : // Handle special symbols before LinkParser
                  /^[^a-zA-Z0-9\s]+$/.test(part) ? (
                    <>{part}</>
                  ) : (
                    <LinkParser watchers={watchers}>{part}</LinkParser>
                  )}
                </span>
              );
            })
            .filter(Boolean);
          elements.push(
            <span key={index} className={`${cssText} opacity-90 font-normal tracking-wide`}>
              {processedParts}
              {index < lines.length - 1 && <br />}
            </span>
          );
        }
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
