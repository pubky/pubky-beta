import { UserProfile } from './components';
import { getSeoMetadata } from '@/components/HeaderSEO';
import { getFile } from '@/services/fileService';
import { getUserDetails } from '@/services/userService';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}`;

type Props = {
  params: Promise<{ creatorPubky: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { creatorPubky } = await params;
  const profile = await getUserDetails(creatorPubky);
  const profilePic = profile?.image && (await getFile(profile.image));

  const file =
    profilePic &&
    `${BASE_URL}/static/files/${JSON.parse(profilePic?.urls).main}`;

  return getSeoMetadata({
    title: `${profile.name} | Profile`,
    description: profile.bio,
    image: file,
  });
}

export default async function Index({ params }: Props) {
  return <UserProfile.Content params={params} />;
}
