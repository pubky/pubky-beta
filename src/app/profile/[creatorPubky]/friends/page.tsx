import { getSeoMetadata } from '@components/HeaderSEO';
import { getFile } from '@/services/fileService';
import { getUserDetails } from '@/services/userService';
import CreatorpubkyLayout from '../components/_CreatorpubkyLayout';
import ContactsProfile from '../../components/_ContactsProfile/ContactsProfile';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}`;

type Props = {
  params: Promise<{ creatorPubky: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { creatorPubky } = await params;
  try {
    const profile = await getUserDetails(creatorPubky);
    const profilePic = profile?.image && profile.image !== 'null' && (await getFile(profile.image));

    const file = profilePic && `${BASE_URL}/static/files/${JSON.parse(profilePic?.urls).main}`;

    return getSeoMetadata({
      title: `${profile.name} - Friends | Profile`,
      description: profile.bio,
      image: String(file)
    });
  } catch (error) {
    return getSeoMetadata({
      title: '404 | Profile',
      description: 'User profile not found or an error occurred'
      // image: `${BASE_URL}/default-error-image.png`, // TODO: Add default error image
    });
  }
}

export default async function Index({ params }: Props) {
  return (
    <CreatorpubkyLayout params={params}>
      <ContactsProfile contacts="friends" creatorPubky={(await params).creatorPubky} />
    </CreatorpubkyLayout>
  );
}
