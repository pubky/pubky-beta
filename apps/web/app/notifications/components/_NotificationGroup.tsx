import { useState, useEffect } from 'react';
import { Utils } from '@social/utils-shared';
import Image from 'next/image';
import { Icon, Typography, Button } from '@social/ui-shared';
import { useClientContext } from '@/contexts';
import { INotification, IUserProfile } from '@/types';
import Link from 'next/link';

type NotificationGroupProps = {
  notifications: INotification[];
};

export default function NotificationGroup({
  notifications,
}: NotificationGroupProps) {
  const { getUser } = useClientContext();
  const [users, setUsers] = useState<IUserProfile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const userProfiles = await Promise.all(
          notifications.map((notification) =>
            getUser(notification.body.followedBy!)
          )
        );
        console.log("users", userProfiles);
        setUsers(userProfiles);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfiles();
  }, [notifications, getUser]);

  return (
    <div className="p-3 border-b border-white border-opacity-10 justify-between items-start flex flex-row">
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button.Action
          size="small"
          variant="custom"
          icon={<Icon.UserPlus size="16" />}
          className="bg-gradient-none border border-white border-opacity-30"
          disabled
        />
        <div className="flex gap-2 items-center flex-wrap">
          {users.map((user, index) => (
            <Link
              key={index}
              href={`/profile/${user.userId}`}
              className="flex gap-2 items-center"
            >
              <Image
                width={32}
                height={32}
                className="w-[32px] h-[32px] rounded-full"
                alt="user-pic"
                src={user.profile.image || '/images/Userpic.png'}
              />
              <Typography.Body
                className="hover:underline hover:decoration-solid"
                variant="medium-bold"
              >
                {Utils.minifyText(user.profile.name, 20)}
                {index < users.length - 1 && <span>, </span>}
              </Typography.Body>
            </Link>
          ))}
          <Typography.Body variant="medium-bold" className="text-opacity-50">
            followed you
          </Typography.Body>
        </div>
      </div>
      <div className="grow shrink basis-0 h-8 flex-col justify-center items-end gap-1 inline-flex">
        <Typography.Caption className="items-center flex gap-2 text-white text-opacity-50">
          <Icon.Clock size="13" color="gray" />
          {Utils.timeAgo(notifications[0].timestamp)}
        </Typography.Caption>
      </div>
    </div>
  );
}
