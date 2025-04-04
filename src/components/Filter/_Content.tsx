'use client';

import { useFilterContext } from '@/contexts';
import { TContent } from '@/types';
import { Icon, SideCard } from '@social/ui-shared';
import { useEffect, useState } from 'react';

interface ReachProps {
  disabled?: boolean;
}

export default function Content({ disabled = false }: ReachProps) {
  const { content, setContent } = useFilterContext();
  const [loading, setLoading] = useState(true);

  const icons = {
    all: <Icon.Stack />,
    posts: <Icon.NoteBlank />,
    articles: <Icon.Newspaper />,
    images: <Icon.ImageSquare />,
    videos: <Icon.Play />,
    links: <Icon.LinkSimple />,
    files: <Icon.DownloadSimple size="24" />
  };

  const contentMapping: Record<string, TContent> = {
    long: 'articles',
    short: 'posts',
    image: 'images',
    video: 'videos',
    link: 'links',
    file: 'files'
  };

  useEffect(() => {
    setContent((contentMapping[content] || content || 'all') as TContent);
    setLoading(false);
  }, [content]);

  const handleItemClick = (value: TContent) => {
    setContent(value);
  };

  return (
    <div className="mb-6">
      <SideCard.Header title="Content" className="mb-2" />
      {Object.entries(icons).map(([key, icon]) => (
        <SideCard.Item
          id={`content-${key}-btn`}
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={key}
          selected={loading ? false : content === key}
          icon={icon}
          onClick={!disabled ? () => handleItemClick(key as TContent) : undefined}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
