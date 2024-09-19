import { useUserProfile } from '@/hooks/useUser';
import { ImageByUri } from '@/components/ImageByUri';

export const UserProfileForTag = ({ userId }: { userId: string }) => {
  const { data: profile } = useUserProfile(userId);

  if (!profile) return null;

  return (
    <ImageByUri
      width={32}
      height={32}
      alt={`pic-${userId}`}
      className={`w-[32px] h-[32px] rounded-full`}
      uri={profile?.details?.image || '/images/Userpic.png'}
    />
  );
};
