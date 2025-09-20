'use client';

import { useMemo } from 'react';
import type { Message } from 'qvac-web';
import { useQvacStream } from './useQvacStreaming';

export function useSummarization() {
  const pb = useMemo(
    () => (input: string): Message[] => [
      { role: 'system', content: 'Summarize the user text clearly in 2–3 sentences. No preface, just the summary.' },
      { role: 'user', content: input },
    ],
    []
  );

  const { start, cancel, loading, text, setText } = useQvacStream(pb);
  return {
    summarize: start,
    cancel,
    loading,
    summary: text,
    setSummary: setText,
  };
}
