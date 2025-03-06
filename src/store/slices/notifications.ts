import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NotificationView, FilterNotificationPreferences, BodyNotification } from '@/types/User';
import { RootState } from '../index';
import { getUserNotifications } from '@/services/userService';

interface NotificationsState {
  notifications: NotificationView[];
  loading: boolean;
  skip: number;
  limit: number;
  hasMore: boolean;
  unreadCount: number;
  timestamp: number;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  skip: 0,
  limit: 30,
  hasMore: true,
  unreadCount: 0,
  timestamp: 0
};

const extractSenderPubky = (notification: BodyNotification) => {
  return (
    notification.followed_by ||
    notification.tagged_by ||
    notification.replied_by ||
    notification.reposted_by ||
    notification.mentioned_by ||
    notification.deleted_by ||
    notification.edited_by
  );
};

interface FetchNotificationsParams {
  pubky: string;
  mutedUsers?: string[];
  notificationPreferences?: Record<string, boolean>;
  timestamp?: number;
}

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (
    { pubky, mutedUsers = [], notificationPreferences = {}, timestamp = 0 }: FetchNotificationsParams,
    { getState }
  ) => {
    const state = getState() as RootState;
    const { skip, limit, selectedFilter } = state.notifications;

    const notifications = await getUserNotifications(pubky, undefined, undefined, skip, limit);

    // Filtra as notificações com base nas preferências e usuários mutados
    const filteredNotifications = notifications.filter((notification: NotificationView) => {
      const senderPubky = extractSenderPubky(notification.body);
      return (
        senderPubky &&
        !mutedUsers?.includes(senderPubky) &&
        notificationPreferences[notification.body.type as keyof typeof notificationPreferences]
      );
    });

    // Calcula o número de notificações não lidas
    const unreadCount =
      timestamp > 0
        ? filteredNotifications.reduce(
            (count: number, notification: NotificationView) => (notification.timestamp > timestamp ? count + 1 : count),
            0
          )
        : 0;

    return {
      notifications: filteredNotifications,
      unreadCount
    };
  }
);

interface LoadMoreNotificationsParams {
  pubky: string;
  mutedUsers?: string[];
  notificationPreferences?: Record<string, boolean>;
}

export const loadMoreNotifications = createAsyncThunk(
  'notifications/loadMore',
  async ({ pubky, mutedUsers = [], notificationPreferences = {} }: LoadMoreNotificationsParams, { getState }) => {
    const state = getState() as RootState;
    const { skip, limit } = state.notifications;

    const notifications = await getUserNotifications(pubky, undefined, undefined, skip + limit, limit);

    // Filtra as notificações com base nas preferências e usuários mutados
    const filteredNotifications = notifications.filter((notification: NotificationView) => {
      const senderPubky = extractSenderPubky(notification.body);
      return (
        senderPubky &&
        !mutedUsers?.includes(senderPubky) &&
        notificationPreferences[notification.body.type as keyof typeof notificationPreferences]
      );
    });

    return filteredNotifications;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedFilter: (state, action: PayloadAction<FilterNotificationPreferences>) => {
      state.selectedFilter = action.payload;
      state.skip = 0;
      state.notifications = [];
      state.hasMore = true;
    },
    setTimestamp: (state, action: PayloadAction<number>) => {
      state.timestamp = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    resetNotifications: (state) => {
      state.notifications = [];
      state.skip = 0;
      state.hasMore = true;
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.hasMore = action.payload.notifications.length > 0 && action.payload.notifications.length >= state.limit;

        // Calculate unread count when we get new notifications
        if (state.timestamp) {
          const unreadCount = action.payload.notifications.reduce(
            (count, notification) => (notification.timestamp > state.timestamp ? count + 1 : count),
            0
          );
          state.unreadCount = unreadCount;
        }
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loadMoreNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadMoreNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = [...state.notifications, ...action.payload];
        state.hasMore = action.payload.length > 0 && action.payload.length >= state.limit;
        state.skip = state.skip + state.limit;
      })
      .addCase(loadMoreNotifications.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { setSelectedFilter, setTimestamp, setUnreadCount, resetNotifications } = notificationsSlice.actions;

// Selectors
export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectNotificationsLoading = (state: RootState) => state.notifications.loading;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectHasMore = (state: RootState) => state.notifications.hasMore;
export const selectTimestamp = (state: RootState) => state.notifications.timestamp;

export default notificationsSlice.reducer;
