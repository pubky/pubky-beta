'use client';
import { Profile } from '../../components';
import TaggedAs from '../../components/_TaggedAs';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ProfileContentSwitcherProps {
  creatorPubky: string;
}

const ProfileContentSwitcher = ({ creatorPubky }: ProfileContentSwitcherProps) => {
  const isMobile = useIsMobile();
  return isMobile ? <TaggedAs creatorPubky={creatorPubky} /> : <Profile.Posts creatorPubky={creatorPubky} />;
};

export default ProfileContentSwitcher;
