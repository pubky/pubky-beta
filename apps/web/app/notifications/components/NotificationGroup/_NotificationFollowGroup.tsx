import { useState, useEffect } from 'react';
import { Button, Icon, PostUtil, Typography } from '@social/ui-shared';
import { INotification, IUserProfile } from '@/types';
import { useClientContext } from '@/contexts';
import Link from 'next/link';
import Image from 'next/image';
import { Utils } from '@social/utils-shared';

interface NotificationFollowGroupProps {
  group: INotification[];
}

export default function NotificationFollowGroup({
  group,
}: NotificationFollowGroupProps) {
  const { getUser } = useClientContext();
  const [users, setUsers] = useState<IUserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const notificationType = group[0].type;

  useEffect(() => {
    const fetchProfiles = async () => {
      let userIds: string[] = [];

      if (notificationType === 'follow' || notificationType === 'new_friend') {
        userIds = group
          .map((notification) => notification.body.followedBy)
          .filter((userId): userId is string => !!userId);
      } else if (notificationType === 'lost_friend') {
        userIds = group
          .map((notification) => notification.body.unfollowedBy)
          .filter((userId): userId is string => !!userId);
      }

      const userProfiles = await Promise.all(
        userIds.map((userId) => getUser(userId))
      );

      const uniqueUsers = Array.from(
        new Map(
          userProfiles
            .filter((profile): profile is IUserProfile => !!profile)
            .map((user) => [user.userId, user])
        ).values()
      );

      setUsers(uniqueUsers);
      setLoading(false);
    };

    if (
      notificationType === 'follow' ||
      notificationType === 'new_friend' ||
      notificationType === 'lost_friend'
    ) {
      fetchProfiles();
    }
  }, [group, getUser, notificationType]);

  if (loading) {
    return (
      <div className="p-3 border-b border-white border-opacity-10 flex justify-between items-center">
        <Typography.Body variant="medium-bold">Loading...</Typography.Body>
      </div>
    );
  }

  const images = users.map((user) =>
    user.profile.image ? user.profile.image : '/images/Userpic.png'
  );
  const displayedImages = images.slice(0, 4);
  const extraImagesCount = images.length - displayedImages.length;
  const lastNotificationTimestamp = group[group.length - 1].timestamp;

  return (
    <div className="p-3 border-b border-white border-opacity-10 justify-between items-start flex flex-row">
      <div className="flex gap-4 items-center">
        <Button.Action
          size="small"
          variant="custom"
          icon={<Icon.UserPlus size="16" />}
          className="bg-gradient-none border border-white border-opacity-30"
          disabled
        />
        <div className="flex items-center gap-2">
          {displayedImages.map((image, index) => (
            <Image
              width={32}
              height={32}
              key={index}
              className={`max-w-none w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                index > 0 && '-ml-4'
              }`}
              alt={`user-${index + 1}`}
              src={image}
            />
          ))}
          {extraImagesCount > 0 && (
            <PostUtil.Counter className="-ml-4">
              +{extraImagesCount}
            </PostUtil.Counter>
          )}
          <Typography.Body variant="medium-bold">
            {users.slice(0, 3).map((user, index) => (
              <span key={user.userId}>
                <Link
                  href={`/profile/${user.userId}`}
                  className="hover:underline"
                >
                  {Utils.minifyText(user?.profile?.name, 12)}
                </Link>
                {index < Math.min(users.length, 3) - 1 ? ', ' : ' '}
              </span>
            ))}
            <span className="text-white text-opacity-50">
              {users.length > 3 && ` and other ${users.length - 3}`}{' '}
              {notificationType === 'follow'
                ? 'followed you'
                : notificationType === 'new_friend'
                ? 'are your friends now'
                : 'are not your friend anymore'}
            </span>
          </Typography.Body>
        </div>
      </div>
      <div className="grow shrink basis-0 h-8 flex-col justify-center items-end gap-1 inline-flex">
        <Typography.Caption className="items-center flex gap-2 text-white text-opacity-50">
          <Icon.Clock size="13" color="gray" />
          {lastNotificationTimestamp &&
            Utils.timeAgo(lastNotificationTimestamp)}
        </Typography.Caption>
      </div>
    </div>
  );
}
