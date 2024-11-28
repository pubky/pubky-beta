import { useState, useEffect } from 'react';
import { Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '../ImageByUri';
import { UserView } from '@/types/User';
import { usePubkyClientContext } from '@/contexts';
import { getUserProfile } from '@/services/userService';

interface SearchedUsersCardProps {
  searchedUsers: UserView[];
  handleUserClick: (userId: string) => void;
}

export default function SearchedUsersCard({
  searchedUsers,
  handleUserClick,
}: SearchedUsersCardProps) {
  const { pubky } = usePubkyClientContext();
  const [userProfiles, setUserProfiles] = useState<UserView[]>([]);

  useEffect(() => {
    async function fetchProfiles() {
      if (searchedUsers.length > 0) {
        const profiles = await Promise.all(
          searchedUsers.map((user) =>
            getUserProfile(user?.details?.id, pubky ?? ''),
          ),
        );
        setUserProfiles(profiles);
      }
    }

    fetchProfiles();
  }, [searchedUsers, pubky]);

  return (
    <div
      id="searched-users-card"
      className="md:w-[300px] max-w-[300px] z-50 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-webkit rounded-2xl border border-white border-opacity-30 p-4 flex flex-col gap-2 absolute bg-gradient-to-t from-[#07040a] to-[#1b1820]"
    >
      {userProfiles.map((data, index) => {
        const user = searchedUsers[index];
        return (
          <div
            onClick={() => handleUserClick(user?.details?.id)}
            className="cursor-pointer flex gap-2"
            key={`${index}-${user?.details?.id}`}
          >
            <ImageByUri
              width={40}
              height={40}
              className="rounded-full max-w-none h-none"
              style={{ width: `${40}px`, height: `${40}px` }}
              alt={'user'}
              uri={data?.details?.image}
            />
            <div className="flex-col justify-start items-start inline-flex">
              <Typography.Body variant="medium-bold">
                {data?.details?.name &&
                  Utils.minifyText(data?.details?.name, 20)}
              </Typography.Body>
              <Typography.Label className="text-opacity-30 -mt-1">
                {Utils.minifyPubky(user?.details?.id)}
              </Typography.Label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
