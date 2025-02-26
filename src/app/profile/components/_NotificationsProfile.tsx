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
import { FilterNotificationPreferences } from '@/types';

const filterMap: Record<FilterNotificationPreferences, string[]> = {
  all: [],
  follow: ['follow'],
  new_friend: ['new_friend'],
  tagged: ['tag_profile', 'tag_post'],
  mention: ['mention'],
  reply: ['reply'],
  repost: ['repost'],
  post_deleted: ['post_deleted'],
  post_edited: ['post_edited'],
};

export default function NotificationsProfile() {
  const {
    notifications,
    loading: loadingNotifications,
    loadMoreNotifications,
  } = useNotificationsContext();
  const { unReadNotification, setUnReadNotification } = useFilterContext();
  const [tempUnReadNotication, setTempUnReadNotification] = useState(0);
  const [selectedFilter, setSelectedFilter] =
    useState<FilterNotificationPreferences>('all');
  const { putTimestampNotification } = usePubkyClientContext();

  const loader = useInfiniteScroll(loadMoreNotifications, loadingNotifications);

  const filteredNotifications = notifications.filter(
    (notification) =>
      selectedFilter === 'all' ||
      filterMap[selectedFilter]?.includes(notification.body.type),
  );

  const displayedNotifications =
    filteredNotifications.slice(tempUnReadNotication);

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
        <div className="flex flex-col gap-1">
          <Notifications.FilterTabs
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
          <div className="px-6 py-[18px] bg-white/10 rounded-b-lg">
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
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((notification, index) => {
                const isLastElement =
                  index === displayedNotifications.length - 1;
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
                description="Try selecting a different filter."
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
