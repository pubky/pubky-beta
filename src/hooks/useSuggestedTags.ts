import { useState, useEffect, KeyboardEvent } from 'react';
import { searchTagsByPrefix } from '@/services/streamService';

interface UseSuggestedTagsProps {
  tagInput: string;
  onTagSelect?: (tag: string) => void;
}

export const useSuggestedTags = ({ tagInput, onTagSelect }: UseSuggestedTagsProps) => {
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>(-1);

  useEffect(() => {
    if (!tagInput.trim()) {
      setSuggestedTags([]);
      setSelectedTagIndex(-1);
      return;
    }

    let isActive = true;
    const timeoutId = setTimeout(async () => {
      try {
        const tags = await searchTagsByPrefix(tagInput.trim(), 0, 3);
        if (isActive) {
          setSuggestedTags(tags || []);
          setSelectedTagIndex(-1);
        }
      } catch (error) {
        if (isActive) {
          setSuggestedTags([]);
          setSelectedTagIndex(-1);
        }
      }
    }, 500);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [tagInput]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (suggestedTags.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedTagIndex((prev) => 
          prev < suggestedTags.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedTagIndex((prev) => (prev > -1 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (selectedTagIndex > -1) {
          e.preventDefault();
          e.stopPropagation();
          const selectedTag = suggestedTags[selectedTagIndex];
          onTagSelect?.(selectedTag);
          setSuggestedTags([]);
          setSelectedTagIndex(-1);
        }
        break;
      case 'Escape':
        setSuggestedTags([]);
        setSelectedTagIndex(-1);
        break;
    }
  };

  const handleTagClick = (tag: string) => {
    onTagSelect?.(tag);
    setSuggestedTags([]);
    setSelectedTagIndex(-1);
  };

  return {
    suggestedTags,
    selectedTagIndex,
    handleKeyDown,
    handleTagClick,
    setSuggestedTags,
    setSelectedTagIndex
  };
}; 