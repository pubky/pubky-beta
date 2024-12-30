import { getSeoMetadata } from '@components/HeaderSEO';
import { getFile } from '@/services/fileService';
import { getUserDetails } from '@/services/userService';
import CreatorpubkyLayout from './components/_CreatorpubkyLayout';
import { Profile } from '../components';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}`;

type Props = {
  params: Promise<{ creatorPubky: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { creatorPubky } = await params;

  const get404Seo = () =>
    getSeoMetadata({
      title: '404 | Profile',
      description: 'User profile not found or an error occurred',
      // image: `${BASE_URL}/default-error-image.png`, // TODO: Add default error image
    });

  try {
    const profile = await getUserDetails(creatorPubky);
    if (!profile || profile.name === '[DELETED]') {
      return get404Seo();
    }

    let profilePic;
    try {
      profilePic =
        profile.image &&
        profile.image !== 'null' &&
        (await getFile(profile.image));
    } catch (error) {
      console.log(error);
    }

    const file =
      profilePic &&
      `${BASE_URL}/static/files/${JSON.parse(profilePic?.urls).main}`;

    return getSeoMetadata({
      title: `${profile.name} | Profile`,
      description: profile.bio,
      image: String(file),
    });
  } catch (error) {
    return get404Seo();
  }
}

export default async function Index({ params }: Props) {
  return (
    <CreatorpubkyLayout params={params}>
      <Profile.Posts creatorPubky={(await params).creatorPubky} />
    </CreatorpubkyLayout>
  );
}
