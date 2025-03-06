import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectUnreadCount,
  selectNotifications,
  selectNotificationsLoading,
  selectHasMore,
  selectTimestamp,
  fetchNotifications,
  loadMoreNotifications,
  setTimestamp,
  setUnreadCount,
  resetNotifications
} from '@/store/slices/notifications';

export function useNotifications() {
  const dispatch = useAppDispatch();

  const unReadNotification = useAppSelector(selectUnreadCount);
  const notifications = useAppSelector(selectNotifications);
  const loading = useAppSelector(selectNotificationsLoading);
  const hasMore = useAppSelector(selectHasMore);
  const timestamp = useAppSelector(selectTimestamp);

  return {
    unReadNotification,
    notifications,
    loading,
    hasMore,
    timestamp,
    fetchNotifications: (params) => dispatch(fetchNotifications(params)),
    loadMoreNotifications: (params) => dispatch(loadMoreNotifications(params)),
    setTimestamp: (value) => dispatch(setTimestamp(value)),
    setUnreadCount: (value) => dispatch(setUnreadCount(value)),
    resetNotifications: () => dispatch(resetNotifications())
  };
}
