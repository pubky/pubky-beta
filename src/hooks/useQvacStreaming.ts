'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient, type Message } from 'qvac-web';

const QVAC_URL   = process.env.NEXT_PUBLIC_QVAC_URL   ?? 'https://localhost:3712';
const QVAC_TOKEN = process.env.NEXT_PUBLIC_QVAC_TOKEN ?? 'devtoken';
const LLAMA_PATH = 'Llama-3.2-1B-Instruct-Q4_0.gguf';

let _client: ReturnType<typeof createClient> | null = null;
let _modelId: string | null = null;
let _loadingModel: Promise<string> | null = null;

async function ensureClientAndModel(): Promise<{ c: ReturnType<typeof createClient>, modelId: string }> {
  if (!_client) _client = createClient({ relayUrl: QVAC_URL, token: QVAC_TOKEN });
  if (_modelId) return { c: _client, modelId: _modelId };
  if (!_loadingModel) {
    _loadingModel = (async () => {
      const id = await _client!.loadModel(LLAMA_PATH, { modelType: 'llm' });
      _modelId = id;
      return id;
    })();
  }
  return { c: _client, modelId: await _loadingModel };
}

/**
 * Stream helper for LLM prompts.
 * Pass a function that builds the history (messages) from an input string.
 */
export function useQvacStream(promptBuilder: (input: string) => Message[]) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(async (input: string) => {
    setLoading(true);
    setText('');
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const { c, modelId } = await ensureClientAndModel();
      const history = promptBuilder(input);
      for await (const ev of c.completionStream(modelId, history, undefined, { signal: abortRef.current.signal })) {
        if (ev.type === 'token') setText(prev => prev + ev.token);
      }
    } finally {
      setLoading(false);
    }
  }, [promptBuilder]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { start, cancel, loading, text, setText };
}

// Ensure this file is always treated as a module by TS (defensive in case of future edits)
export {};
