'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
// ⬇️ Adjust this import if your client lives elsewhere in your app
import { createClient } from 'qvac-web'; // e.g. '@/lib/qvac-web' or your local dist build

type QvacClient = ReturnType<typeof createClient>;

const LLM_MODEL = 'Llama-3.2-1B-Instruct-Q4_0.gguf';
const LLM_TYPE: 'llm' = 'llm';
const STORAGE_KEY = 'qvac_llm_modelId';

/**
 * Make / reuse a single client instance for this browser tab.
 */
function useQvacClient(): QvacClient {
  // Prefer env, fallback to defaults used in your playground
  const relayUrl =
    (typeof window !== 'undefined' && (window as any).QVAC_RELAY_URL) ||
    process.env.NEXT_PUBLIC_QVAC_RELAY_URL ||
    'https://localhost:3712';

  const token =
    (typeof window !== 'undefined' && (window as any).QVAC_RELAY_TOKEN) ||
    process.env.NEXT_PUBLIC_QVAC_RELAY_TOKEN ||
    'devtoken';

  // Stable instance per hook instance
  return useMemo(() => createClient({ relayUrl, token }), [relayUrl, token]);
}

/**
 * Load the LLM once (cached in localStorage). Returns the modelId.
 */
async function ensureModelLoaded(c: QvacClient): Promise<string> {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) return cached;
  } catch {
    /* ignore */
  }

  const modelId = await c.loadModel(LLM_MODEL, { modelType: LLM_TYPE });
  try {
    localStorage.setItem(STORAGE_KEY, modelId);
  } catch {
    /* ignore */
  }
  return modelId;
}

/**
 * Parse tags from LLM output into exactly three lowercase words.
 */
function normalizeTags(raw: string): string[] {
  // Try strict JSON first
  try {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) {
      const arr = j
        .map((x) => String(x || '').toLowerCase().trim())
        .filter(Boolean);
      if (arr.length >= 3) return arr.slice(0, 3);
    }
  } catch {
    /* not JSON */
  }

  // Fallback: split by commas / newlines / pipes / hashes
  const guess = raw
    .replace(/\n/g, ',')
    .split(/[#,|,]/g)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // Keep only single words (no spaces / punctuation), alphanum + hyphen allowed
  const cleaned = guess
    .map((s) => s.replace(/[^a-z0-9-]/g, ''))
    .filter((s) => s.length > 0);

  // Deduplicate while preserving order
  const uniq: string[] = [];
  for (const t of cleaned) {
    if (!uniq.includes(t)) uniq.push(t);
  }

  // Pad if needed
  while (uniq.length < 3) uniq.push('general');

  return uniq.slice(0, 3);
}

/**
 * Hook: Recommend three short tags for a given post/body text.
 *
 * API:
 *   const { recommend, loading, error } = useRecomendTags();
 *   const tags = await recommend(contentText); // -> string[3]
 */
export function useRecomendTags() {
  const client = useQvacClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const modelIdRef = useRef<string | null>(null);

  const recommend = useCallback(
    async (text: string): Promise<string[]> => {
      setLoading(true);
      setError('');
      try {
        if (!text || !text.trim()) return [];

        // Ensure LLM is ready
        const modelId =
          modelIdRef.current || (modelIdRef.current = await ensureModelLoaded(client));

        // Compose prompt for crisp, JSON array output
        const history = [
          {
            role: 'system' as const,
            content:
              'You are a helpful assistant that labels content for a feed. ' +
              'Given the user text, return exactly THREE concise single-word tags (lowercase, ascii, no punctuation). ' +
              'Only respond with a JSON array of strings, e.g. ["technology","opensource","security"].'
          },
          {
            role: 'user' as const,
            content: `Text:\n${text}\n\nReturn JSON array with exactly three tags.`
          }
        ];

        const { text: out } = await client.completion(modelId, history);

        return normalizeTags(out);
      } catch (e: any) {
        const msg = e?.message || 'Failed to recommend tags';
        setError(msg);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  return { recommend, loading, error };
}
