'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQvacStream } from './useQvacStreaming';
import type { Message } from 'qvac-web';

function parseTags(src: string): string[] {
  // look for comma- or newline-separated words; strip punctuation/hashtags; keep 1–3 unique
  const raw = src
    .replace(/[#\[\]\(\)\*\_`"'<>]/g, '')
    .split(/[,|\n]/g)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const words = raw.length ? raw : src.split(/\s+/).map(s => s.trim().toLowerCase());
  const uniq: string[] = [];
  for (const w of words) {
    const clean = w.replace(/[^a-z0-9\-]/g, '');
    if (clean && !uniq.includes(clean)) uniq.push(clean);
    if (uniq.length === 3) break;
  }
  return uniq.slice(0, 3);
}

export function useRecommendTags() {
  const [tags, setTags] = useState<string[]>([]);

  const pb = useMemo(
    () => (input: string): Message[] => [
      {
        role: 'system',
        content:
          'Read the text and propose exactly 3 short, topical tags (single words). Output ONLY the 3 tags separated by commas, no extra text.'
      },
      { role: 'user', content: input },
    ],
    []
  );

  const { start, cancel, loading, text, setText } = useQvacStream(pb);

  // Re-parse at the end (or as it streams for live updates)
  useEffect(() => {
    if (!loading && text) setTags(parseTags(text));
  }, [loading, text]);

  return {
    recommend: start,
    cancel,
    loading,
    tags,
    liveText: text,     // raw streaming text if you want to show it
    setLiveText: setText,
  };
}
