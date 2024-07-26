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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const userProfiles = await Promise.all(
          notifications.map((notification) =>
            notification.type === 'lost_friend'
              ? getUser(notification.body.unfollowedBy!)
              : getUser(notification.body.followedBy!)
          )
        );
        const validProfiles = userProfiles.filter(
          (profile): profile is IUserProfile => profile !== null
        );
        setUsers(validProfiles);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [notifications, getUser]);

  const displayedUsers = users.slice(0, 3);
  const remainingUsersCount = users.length - displayedUsers.length;
  const notificationType = notifications[0].type;

  const message =
    notificationType === 'follow'
      ? 'followed you'
      : notificationType === 'new_friend'
      ? 'are your friends now'
      : notificationType === 'lost_friend'
      ? 'are not your friends anymore'
      : '';

  const icon =
    notificationType === 'follow' ? (
      <Icon.UserPlus size="16" />
    ) : notificationType === 'new_friend' ? (
      <Icon.UsersLeft size="16" />
    ) : notificationType === 'lost_friend' ? (
      <Icon.UserMinus size="16" />
    ) : (
      ''
    );

  return (
    <div className="p-3 border-b border-white border-opacity-10 justify-between items-start flex flex-row">
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button.Action
          size="small"
          variant="custom"
          icon={icon}
          className="bg-gradient-none border border-white border-opacity-30"
          disabled
        />
        <div className="flex gap-2 items-center flex-wrap">
          {loading ? (
            <Typography.Body variant="medium-bold">Loading...</Typography.Body>
          ) : (
            displayedUsers.map((user, index) => (
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
                  {index < displayedUsers.length - 1 && <span>, </span>}
                </Typography.Body>
              </Link>
            ))
          )}
          {remainingUsersCount > 0 && (
            <Typography.Body variant="medium-bold" className="text-opacity-50">
              and other {remainingUsersCount}
            </Typography.Body>
          )}
          <Typography.Body variant="medium-bold" className="text-opacity-50">
            {message}
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
