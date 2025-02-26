import { FileView } from '@/types/Post';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

// Get File details
export async function getFile(fileUri: string): Promise<FileView> {
  const fileUriEncoded = encodeURIComponent(fileUri);

  if (!fileUriEncoded || fileUriEncoded === 'null') throw new Error('Invalid file uri');

  const response = await fetch(`${BASE_URL}/files/file/${fileUriEncoded}`);

  if (!response.ok) throw new Error('Failed to fetch file');

  const fileData: FileView = await response.json();
  return fileData;
}
