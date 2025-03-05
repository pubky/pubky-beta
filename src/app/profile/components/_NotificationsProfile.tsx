'use client';

import { Notifications } from '@/app/profile/components/notifications/components';
import { ContentNotFound, Skeleton } from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { Icon } from '@social/ui-shared';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectNotifications,
  selectNotificationsLoading,
  selectSelectedFilter,
  selectUnreadCount,
  setSelectedFilter as setReduxSelectedFilter,
  fetchNotifications,
  loadMoreNotifications,
  filterMap,
  setTimestamp,
  setUnreadCount
} from '@/store/slices/notifications';

export default function NotificationsProfile() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const loadingNotifications = useAppSelector(selectNotificationsLoading);
  const selectedFilter = useAppSelector(selectSelectedFilter);
  const unreadCount = useAppSelector(selectUnreadCount);
  const [tempUnReadNotification, setTempUnReadNotification] = useState(0);
  const { putTimestampNotification, pubky, mutedUsers, notificationPreferences, timestamp } = usePubkyClientContext();
  const hasInitialized = useRef(false);
  const hasFetchedInitial = useRef(false);

  const fetchNotificationsData = useCallback(() => {
    if (!pubky || !notificationPreferences || !timestamp) return;

    dispatch(
      fetchNotifications({
        pubky,
        mutedUsers,
        notificationPreferences,
        timestamp
      })
    );
  }, [pubky, notificationPreferences, mutedUsers, timestamp, dispatch]);

  const handleLoadMore = async () => {
    if (!pubky || !notificationPreferences) return;

    dispatch(
      loadMoreNotifications({
        pubky,
        mutedUsers,
        notificationPreferences
      })
    );
  };

  const loader = useInfiniteScroll(handleLoadMore, loadingNotifications);

  const filteredNotifications = notifications.filter(
    (notification) => selectedFilter === 'all' || filterMap[selectedFilter]?.includes(notification.body.type)
  );

  const displayedNotifications = filteredNotifications.slice(tempUnReadNotification);

  // Efeito único para controlar todo o fluxo de inicialização e fetch
  useEffect(() => {
    const initialize = async () => {
      // Se não temos as dependências necessárias, não fazemos nada
      if (!pubky || !notificationPreferences) return;

      // Se ainda não inicializamos, fazemos a inicialização
      if (!hasInitialized.current) {
        try {
          await putTimestampNotification();
          hasInitialized.current = true;
        } catch (error) {
          console.error('Error initializing notifications:', error);
          return;
        }
      }

      // Se temos um timestamp válido e ainda não fizemos o fetch inicial
      if (timestamp && !hasFetchedInitial.current) {
        dispatch(setTimestamp(timestamp));
        hasFetchedInitial.current = true;
        fetchNotificationsData();
        return;
      }

      // Se já fizemos o fetch inicial e o filtro mudou
      if (hasFetchedInitial.current && selectedFilter) {
        fetchNotificationsData();
      }
    };

    initialize();
  }, [pubky, notificationPreferences, timestamp, selectedFilter, dispatch, fetchNotificationsData]);

  // Efeito para lidar com notificações não lidas
  useEffect(() => {
    if (unreadCount) {
      setTempUnReadNotification(unreadCount);
      setTimeout(() => setTempUnReadNotification(0), 3000);
      dispatch(setUnreadCount(0));
    }
  }, [unreadCount, dispatch]);

  const handleFilterChange = (newFilter: typeof selectedFilter) => {
    dispatch(setReduxSelectedFilter(newFilter));
  };

  return (
    <>
      {loadingNotifications && notifications.length === 0 ? (
        <Skeleton.Simple />
      ) : (
        <div className="flex flex-col gap-1">
          <Notifications.FilterTabs selectedFilter={selectedFilter} setSelectedFilter={handleFilterChange} />
          <div className="px-6 py-[18px] bg-white/10 rounded-b-lg">
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
