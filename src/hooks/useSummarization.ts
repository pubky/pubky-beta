'use client';

import { useCallback, useRef, useState } from 'react';
// ⬇️ If your library name/path differs, change this import.
import { createClient, type Message } from 'qvac-web';

const RELAY_URL =
  process.env.NEXT_PUBLIC_QVAC_RELAY_URL ?? 'https://localhost:3712';
const TOKEN = process.env.NEXT_PUBLIC_QVAC_TOKEN ?? 'devtoken';

// Hardcode to LLaMA 3.2 1B
const LLM_PATH = 'Llama-3.2-1B-Instruct-Q4_0.gguf';

let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (_client) return _client;
  _client = createClient({ relayUrl: RELAY_URL, token: TOKEN });
  return _client;
}

export function useSummarization() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modelIdRef = useRef<string | null>(null);

  const ensureModel = useCallback(async () => {
    if (modelIdRef.current) return modelIdRef.current;
    const c = getClient();
    const id = await c.loadModel(LLM_PATH, { modelType: 'llm' });
    modelIdRef.current = id;
    return id;
  }, []);

  const summarize = useCallback(
    async (text: string): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        const c = getClient();
        const modelId = await ensureModel();

        const history: Message[] = [
          {
            role: 'system',
            content:
              'You are a concise assistant. Summarize the user text in ~5 bullet points. Keep total under 120 words. Preserve key facts. No preamble.',
          },
          { role: 'user', content: text },
        ];

        const { text: out } = await c.completion(modelId, history);
        return out.trim();
      } catch (e: any) {
        setError(e?.message || String(e));
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [ensureModel]
  );

  return {
    summarize,
    loading,
    error,
    modelId: modelIdRef.current,
  };
}
