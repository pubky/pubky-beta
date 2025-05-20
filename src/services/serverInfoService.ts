import { ServerInfo } from '../types/ServerInfo';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

// Get info server
export async function getServerInfo(): Promise<ServerInfo> {
  const response = await fetch(`${BASE_URL}/info`);
  if (!response.ok) throw new Error('Failed to fetch server info');
  return response.json();
}
