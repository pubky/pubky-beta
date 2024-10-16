import { PubkyAppFile } from '@/types/Post';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

export async function getFile(fileUri: string): Promise<PubkyAppFile> {
  const response = await fetch(
    `${BASE_URL}/files/file/${encodeURIComponent(fileUri)}`
  );

  if (!response.ok) throw new Error('Failed to fetch file');

  const fileData: PubkyAppFile = await response.json();
  return fileData;
}
