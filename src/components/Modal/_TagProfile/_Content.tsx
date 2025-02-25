import { Input } from '@social/ui-shared';
import { UserTags, UserView } from '@/types/User';
import { useUtilsTag } from './components/_Utils';
import InputTag from './components/_InputTag';
import Tags from './components/_Tags';

interface ProfileTagProps extends React.HTMLAttributes<HTMLDivElement> {
  profileTags: UserTags[];
  setProfileTags: React.Dispatch<React.SetStateAction<UserTags[]>>;
  pubkyUser?: string;
  user?: UserView | null;
}

export default function ContentProfileTag({
  profileTags,
  setProfileTags,
  pubkyUser,
  user,
}: ProfileTagProps) {
  const { selectedTag } = useUtilsTag({
    profileTags,
    setProfileTags,
    pubkyUser,
    user,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <InputTag
        profileTags={profileTags}
        setProfileTags={setProfileTags}
        pubkyUser={pubkyUser}
        user={user}
      />
      <div className="justify-start items-start gap-2 flex flex-col overflow-y-auto min-w-[200px] max-h-[300px] scrollbar-thin scrollbar-webkit">
        <Input.Label value={selectedTag ? 'Tagged' : 'Current tags'} />
        <Tags
          profileTags={profileTags}
          setProfileTags={setProfileTags}
          pubkyUser={pubkyUser}
          user={user}
        />
      </div>
    </div>
  );
}
