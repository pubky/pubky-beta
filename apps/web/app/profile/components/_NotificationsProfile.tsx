'use client';

import { Notifications } from '@/app/profile/components/notifications/components';
import { ContentNotFound, Skeleton } from '@/components';
import {
  useFilterContext,
  useNotificationsContext,
  usePubkyClientContext,
} from '@/contexts';
import { Icon } from '@social/ui-shared';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function NotificationsProfile() {
  const {
    notifications,
    loading: loadingNotifications,
    loadMoreNotifications,
  } = useNotificationsContext();
  const { unReadNotification, setUnReadNotification } = useFilterContext();
  const [tempUnReadNotication, setTempUnReadNotification] = useState(0);
  const { putTimestampNotification } = usePubkyClientContext();

  const loader = useInfiniteScroll(loadMoreNotifications, loadingNotifications);

  const displayedNotifications = notifications.slice(tempUnReadNotication);

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
      ) : notifications?.length === 0 ? (
        <ContentNotFound
          icon={<Icon.SmileySad size="48" color="#C8FF00" />}
          title="Nothing to see here yet"
          description="Tags, follows, reposts, and account information will be displayed here."
        >
          <div className="absolute top-32 z-0">
            <Image
              alt="not-found-notification"
              width={477}
              height={271}
              src="/images/webp/not-found/search.webp"
            />
          </div>
        </ContentNotFound>
      ) : (
        <div className="px-6 py-[18px] bg-white/10 rounded-lg">
          {tempUnReadNotication > 0 && (
            <div>
              {notifications
                .slice(0, tempUnReadNotication)
                .map((notification, index) => (
                  <Notifications.Notification
                    key={index}
                    notification={notification}
                    unread
                  />
                ))}
            </div>
          )}
          {displayedNotifications.map((notification, index) => {
            const isLastElement = index === displayedNotifications.length - 1;

            return (
              <div key={index} ref={isLastElement ? loader : null}>
                <Notifications.Notification notification={notification} />
              </div>
            );
          })}
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
