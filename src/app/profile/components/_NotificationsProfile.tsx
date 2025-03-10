'use client';

import { Notifications } from '@/app/profile/components/notifications/components';
import { ContentNotFound, Skeleton } from '@/components';
import { useFilterContext, useNotificationsContext, usePubkyClientContext } from '@/contexts';
import { Icon } from '@social/ui-shared';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useEffect, useState } from 'react';
import { filterMap } from '@/contexts/_notifications';

export default function NotificationsProfile() {
  const {
    notifications,
    loading: loadingNotifications,
    loadMoreNotifications,
    selectedFilter
  } = useNotificationsContext();
  const { unReadNotification, setUnReadNotification } = useFilterContext();
  const [tempUnReadNotification, setTempUnReadNotification] = useState(0);
  const { putTimestampNotification } = usePubkyClientContext();

  const loader = useInfiniteScroll(loadMoreNotifications, loadingNotifications);

  const filteredNotifications = notifications.filter(
    (notification) => selectedFilter === 'all' || filterMap[selectedFilter]?.includes(notification.body.type)
  );

  const displayedNotifications = filteredNotifications.slice(tempUnReadNotification);

  useEffect(() => {
    if (unReadNotification) {
      setTempUnReadNotification(unReadNotification);
      setTimeout(() => setTempUnReadNotification(0), 3000);
    }
    setUnReadNotification(0);
    const putTimestamp = async () => {
      await putTimestampNotification();
    };
    putTimestamp();
  }, []);

  return (
    <>
      {loadingNotifications && notifications.length === 0 ? (
        <Skeleton.Simple />
      ) : (
        <div className="flex flex-col gap-1">
          <div id="notifications-list" className="px-6 py-[18px] bg-white/10 rounded-lg">
            {tempUnReadNotification > 0 && (
              <div>
                {notifications.slice(0, tempUnReadNotification).map((notification, index) => (
                  <Notifications.Notification key={index} notification={notification} unread />
                ))}
              </div>
            )}
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((notification, index) => {
                const isLastElement = index === displayedNotifications.length - 1;
                return (
                  <div key={index} ref={isLastElement ? loader : null}>
                    <Notifications.Notification notification={notification} />
                  </div>
                );
              })
            ) : (
              <ContentNotFound
                icon={<Icon.SmileySad size="48" color="#C8FF00" />}
                title="No notifications to show"
                description="Try selecting a different filter"
              />
            )}
          </div>
        </div>
      )}
      {loadingNotifications && (
        <div className="flex justify-center mt-4 mb-8">
          <Skeleton.Simple />
        </div>
      )}
    </>
  );
}
