const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

export async function getNotifications(userId: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/user/${userId}/notifications`);

  if (!response.ok) throw new Error('Failed to fetch notifications');

  const fileData = await response.json();
  return fileData;
}
