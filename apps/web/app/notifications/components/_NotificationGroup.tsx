import { useState, useEffect } from 'react';
import Notification from './_Notification';
import { Button, Icon, PostUtil, Typography } from '@social/ui-shared';
import { INotification, IUserProfile } from '@/types';
import { useClientContext } from '@/contexts';
import Link from 'next/link';
import Image from 'next/image';
import { Utils } from '@social/utils-shared';

export default function NotificationGroup({
  group,
}: {
  group: INotification[];
}) {
  const { getUser } = useClientContext();
  const [users, setUsers] = useState<IUserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const firstNotification = group[0];
  const notificationType = firstNotification.type;

  useEffect(() => {
    const fetchProfiles = async () => {
      // Extract user IDs based on the notification type
      const userIds = group
        .map((notification) => notification.body.followedBy)
        .filter((userId): userId is string => !!userId);

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

    if (notificationType === 'follow' || notificationType === 'new_friend') {
      fetchProfiles();
    }
  }, [group, getUser, notificationType]);

  if (notificationType === 'follow' || notificationType === 'new_friend') {
    if (loading) {
      return (
        <div className="p-3 border-b border-white border-opacity-10 flex justify-between items-center">
          <Typography.Body variant="medium-bold">Loading...</Typography.Body>
        </div>
      );
    }

    // Extract unique images
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
              {users.map((user, index) => (
                <span key={user.userId}>
                  <Link
                    href={`/profile/${user.userId}`}
                    className="hover:underline"
                  >
                    {Utils.minifyText(user?.profile?.name, 15)}
                  </Link>
                  {index < users.length - 1 ? ', ' : ' '}
                </span>
              ))}{' '}
              <span className="text-white text-opacity-50">
                {notificationType === 'follow'
                  ? 'followed you'
                  : 'are your friends now'}
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

  // For other types of notifications, render each notification separately
  return (
    <>
      {group.map((notification, index) => (
        <Notification key={index} notification={notification} />
      ))}
    </>
  );
}
