'use client';

import { useMemo } from 'react';
import { useQvacStream } from './useQvacStreaming';
import type { Message } from 'qvac-web';

export function useTranslation() {
  const pb = useMemo(
    () => (input: string): Message[] => [
      { role: 'system', content: 'You are a professional translator. Translate the user text to Spanish. Return only the translation, no commentary.' },
      { role: 'user', content: input },
    ],
    []
  );

  const { start, cancel, loading, text, setText } = useQvacStream(pb);
  return {
    translate: start,
    cancel,
    loading,
    translation: text,
    setTranslation: setText,
  };
}
