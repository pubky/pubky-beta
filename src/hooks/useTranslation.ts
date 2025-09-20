'use client';

import { useCallback, useRef, useState } from 'react';
// ⬇️ If your library name/path differs, change this import.
import { createClient } from 'qvac-web';

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

export function useTranslation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modelIdRef = useRef<string | null>(null);

  const ensureModel = useCallback(async () => {
    if (modelIdRef.current) return modelIdRef.current;
    const c = getClient();
    // Fast path: try to load without streaming for simplicity.
    const id = await c.loadModel(LLM_PATH, { modelType: 'llm' });
    modelIdRef.current = id;
    return id;
  }, []);

  const translate = useCallback(
    async (text: string): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        const c = getClient();
        const modelId = await ensureModel();
        // Always EN -> ES
        const out = await c.translate(modelId, text, { from: 'en', to: 'es' });
        return out;
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
    translate,
    loading,
    error,
    modelId: modelIdRef.current,
  };
}
