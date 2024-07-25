import Notification from '../_Notification';

import { INotification } from '@/types';
import NotificationFollowGroup from './_NotificationFollowGroup';
import NotificationTagGroup from './_NotificationTagGroup';

export default function NotificationGroup({
  group,
}: {
  group: INotification[];
}) {
  const notificationType = group[0].type;

  if (
    (notificationType === 'follow' ||
      notificationType === 'new_friend' ||
      notificationType === 'lost_friend') &&
    group.length > 1
  ) {
    return <NotificationFollowGroup group={group} />;
  }

  if (
    (notificationType === 'tag_profile' || notificationType === 'tag_post') &&
    group.length > 1
  ) {
    return <NotificationTagGroup group={group} />;
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
