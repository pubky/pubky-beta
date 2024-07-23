import { IUserProfile } from '@/types';
import { Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Image from 'next/image';

interface SearchedUsersCardProps {
  searchedUsers: IUserProfile[];
  handleUserClick: (userId: string) => void;
}

export default function SearchedUsersCard({
  searchedUsers,
  handleUserClick,
}: SearchedUsersCardProps) {
  return (
    <div
      className={
        'w-[300px] z-50 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-webkit rounded-2xl border border-white border-opacity-30 p-4 flex flex-col gap-2 absolute bg-gradient-to-t from-[#07040a] to-[#1b1820]'
      }
    >
      {searchedUsers.map((user) => (
        <div
          onClick={() => handleUserClick(user.userId)}
          className="cursor-pointer flex gap-2"
          key={user.userId}
        >
          <Image
            width={40}
            height={40}
            className="rounded-full max-w-none h-none"
            style={{ width: `${40}px`, height: `${40}px` }}
            alt={'user'}
            src={user?.profile?.image}
          />
          <div className="flex-col justify-start items-start inline-flex">
            <Typography.Body variant="medium-bold">
              {Utils.minifyText(user?.profile?.name, 20)}
            </Typography.Body>
            <Typography.Label className="text-opacity-30 -mt-1">
              {Utils.minifyPubky(user.userId)}
            </Typography.Label>
          </div>
        </div>
      ))}
    </div>
  );
}
