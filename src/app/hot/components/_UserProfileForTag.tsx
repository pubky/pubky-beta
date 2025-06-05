import { useUserProfile } from '@/hooks/useUser';
import { ImageByUri } from '@/components/ImageByUri';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@/components/utils-shared';

export const UserProfileForTag = ({ userId }: { userId: string }) => {
  const { pubky } = usePubkyClientContext();
  const { data: profile } = useUserProfile(userId, pubky ?? '');

  if (!profile) return null;

  return (
    <ImageByUri
      id={userId}
      isCensored={Utils.isProfileCensored(profile)}
      width={32}
      height={32}
      alt={`pic-${userId}`}
      className={`w-[32px] h-[32px] rounded-full`}
    />
  );
};
