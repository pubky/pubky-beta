'use client';

import { useState, useEffect, useCallback } from 'react';
import { Utils } from '@social/utils-shared';
import { Icon, Typography, PostUtil } from '@social/ui-shared';
import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';
import { getUserProfile } from '@/services/userService';
import { usePubkyClientContext, useNotificationsContext } from '@/contexts';
import { NotificationView, UserView } from '@/types/User';
import { useIsMobile } from '@/hooks/useIsMobile';

const notificationType = {
  follow: {
    type: 'follow',
    icon: <Icon.UserPlus size="24" />,
    text: 'followed you'
  },
  new_friend: {
    type: 'new_friend',
    icon: <Icon.UsersLeft size="24" />,
    text: 'is your friend now'
  },
  lost_friend: {
    type: 'lost_friend',
    icon: <Icon.UserMinus size="24" />,
    text: 'is not your friend anymore'
  },
  tag_post: {
    type: 'tag_post',
    icon: <Icon.Tag size="24" />,
    text: 'tagged your post as'
  },
  tag_profile: {
    type: 'tag_profile',
    icon: <Icon.Tag size="24" />,
    text: 'tagged your profile as'
  },
  reply: {
    type: 'reply',
    icon: <Icon.ChatCircleText size="24" />,
    text: 'replied to your post'
  },
  repost: {
    type: 'repost',
    icon: <Icon.Repost size="24" />,
    text: 'reposted your post'
  },
  mention: {
    type: 'mention',
    icon: <Icon.Note size="24" />,
    text: 'mentioned you in a post'
  },
  post_deleted: {
    type: 'post_deleted',
    icon: <Icon.Trash size="24" />,
    text: 'deleted'
  },
  post_edited: {
    type: 'post_edited',
    icon: <Icon.PencilLine size="24" />,
    text: 'edited'
  }
};

type NotificationTypeKey = keyof typeof notificationType;

export default function Notification({ notification, unread }: { notification: NotificationView; unread?: boolean }) {
  const { pubky } = usePubkyClientContext();
  const { userProfilesCache } = useNotificationsContext();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<UserView | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentNotificationId, setCurrentNotificationId] = useState<string | number>('');

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        const userProfile = await getUserProfile(userId, pubky ?? '');
        setUser(userProfile || null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    },
    [pubky]
  );

  useEffect(() => {
    // Identifier for this notification to track changes
    const notificationId = notification.timestamp;

    // If notification changed, reset everything
    if (notificationId !== currentNotificationId) {
      setCurrentNotificationId(notificationId);
      setUser(undefined);
      setIsLoading(true);
    }

    let userId: string | undefined;
    if (
      notification.body.type === notificationType?.follow?.type ||
      notification.body.type === notificationType?.new_friend?.type ||
      notification.body.type === notificationType?.lost_friend?.type
    ) {
      userId = notification.body.followed_by || notification.body.unfollowed_by;
    } else if (
      notification.body.type === notificationType?.tag_profile?.type ||
      notification.body.type === notificationType?.tag_post?.type
    ) {
      userId = notification.body.tagged_by;
    } else if (notification.body.type === notificationType?.reply?.type) {
      userId = notification.body.replied_by;
    } else if (notification.body.type === notificationType?.repost?.type) {
      userId = notification.body.reposted_by;
    } else if (notification.body.type === notificationType?.mention?.type) {
      userId = notification.body.mentioned_by;
    } else if (notification.body.type === notificationType?.post_deleted?.type) {
      userId = notification.body.deleted_by;
    } else if (notification.body.type === notificationType?.post_edited?.type) {
      userId = notification.body.edited_by;
    }

    if (userId) {
      // Check if user profile is already in cache
      if (userProfilesCache.hasOwnProperty(userId)) {
        setUser(userProfilesCache[userId]);
        setIsLoading(false);
      } else {
        // Fallback to individual fetch if not in cache
        fetchProfile(userId);
      }
    } else {
      // If no userId found, set loading to false immediately
      setIsLoading(false);
    }
  }, [notification, fetchProfile, currentNotificationId, userProfilesCache]);

  const currentNotificationType = notificationType[notification?.body?.type as NotificationTypeKey];

  if (!currentNotificationType) {
    return null;
  }

  const userId =
    notification?.body?.followed_by ||
    notification?.body?.unfollowed_by ||
    notification?.body?.tagged_by ||
    notification?.body?.replied_by ||
    notification?.body?.reposted_by ||
    notification?.body?.mentioned_by ||
    notification?.body?.deleted_by ||
    notification?.body?.edited_by;

  const postLink =
    (notification?.body?.type === notificationType?.tag_post?.type ||
      notification?.body?.type === notificationType?.mention?.type) &&
    notification.body.post_uri
      ? Utils.encodePostUri(notification.body.post_uri)
      : '';

  const replyLink =
    notification?.body?.type === notificationType?.reply?.type && notification.body.reply_uri
      ? Utils.encodePostUri(notification.body.reply_uri)
      : '';

  const parentPostReplyLink =
    notification.body.type === notificationType?.reply?.type && notification.body.parent_post_uri
      ? Utils.encodePostUri(notification.body.parent_post_uri)
      : '';

  const repostLink =
    notification.body.type === notificationType?.repost?.type && notification.body.repost_uri
      ? Utils.encodePostUri(notification.body.repost_uri)
      : '';

  const embedLink =
    notification.body.type === notificationType?.repost?.type && notification.body.embed_uri
      ? Utils.encodePostUri(notification.body.embed_uri)
      : '';

  const deletedPostLink =
    (notification.body.delete_source === 'reply' ||
      notification.body.delete_source === 'repost' ||
      notification.body.delete_source === 'reply_parent' ||
      notification.body.delete_source === 'repost_embed') &&
    notification.body.linked_uri
      ? Utils.encodePostUri(notification.body.linked_uri)
      : '';

  const editedPostLink =
    (notification.body.edit_source === 'reply' ||
      notification.body.edit_source === 'repost' ||
      notification.body.edit_source === 'bookmark' ||
      notification.body.edit_source === 'reply_parent' ||
      notification.body.edit_source === 'repost_embed' ||
      notification.body.edit_source === 'tagged_post') &&
    notification.body.edited_uri
      ? Utils.encodePostUri(notification.body.edited_uri)
      : '';

  const linkedPostLink =
    (notification.body.edit_source === 'reply' ||
      notification.body.edit_source === 'repost' ||
      notification.body.edit_source === 'reply_parent' ||
      notification.body.edit_source === 'repost_embed' ||
      notification.body.edit_source === 'tagged_post') &&
    notification.body.linked_uri
      ? Utils.encodePostUri(notification.body.linked_uri)
      : '';

  return (
    <div className="py-2 justify-between items-start flex flex-row border-b md:border-0 border-white border-opacity-10">
      <div className="flex sm:gap-1 md:gap-3 flex-col sm:flex-row">
        <div className="flex gap-2">
          {isLoading ? (
            <Link href={`/profile/${userId}`} className="flex gap-2 items-center">
              <div className="w-[32px] h-[32px] rounded-full bg-white/10 animate-pulse" />
              <Typography.Body className="hover:underline hover:decoration-solid" variant="medium-bold">
                {Utils.minifyPubky(userId)}
              </Typography.Body>
            </Link>
          ) : user !== undefined ? (
            <Link href={`/profile/${userId}`} className="flex gap-2 items-center">
              <ImageByUri
                id={user?.details?.id}
                isCensored={Utils.isProfileCensored(user)}
                width={32}
                height={32}
                className="w-[32px] h-[32px] rounded-full"
                alt="user-pic"
              />
              <Typography.Body className="hover:underline hover:decoration-solid" variant="medium-bold">
                {Utils.minifyText(user?.details?.name, 20) || '[DELETED]'}
              </Typography.Body>
            </Link>
          ) : (
            <Typography.Body variant="medium-bold" className="text-red-500">
              Error loading user
            </Typography.Body>
          )}
        </div>
        <div className="flex gap-1 md:gap-2 items-center flex-wrap">
          <Typography.Body variant="medium-bold" className="text-opacity-50">
            {currentNotificationType.text}
            {notification.body.type === notificationType?.post_deleted?.type &&
              (notification.body.delete_source === 'reply'
                ? ' a reply of your post'
                : notification.body.delete_source === 'repost'
                  ? ' a repost of your post'
                  : notification.body.delete_source === 'bookmark'
                    ? ' a post you bookmarked'
                    : notification.body.delete_source === 'reply_parent'
                      ? ' a post you replied to'
                      : notification.body.delete_source === 'repost_embed'
                        ? ' a post you reposted'
                        : ' a post you tagged')}
            {notification.body.type === notificationType?.post_edited?.type &&
              (notification.body.edit_source === 'reply'
                ? ' a reply of your post'
                : notification.body.edit_source === 'repost'
                  ? ' a repost of your post'
                  : notification.body.edit_source === 'bookmark'
                    ? ' a post you bookmarked'
                    : notification.body.edit_source === 'reply_parent'
                      ? ' a post you replied to'
                      : notification.body.edit_source === 'repost_embed'
                        ? ' a post you reposted'
                        : ' a post you tagged')}
          </Typography.Body>
          {(notification.body.type === notificationType?.tag_profile?.type ||
            notification.body.type === notificationType?.tag_post?.type) && (
            <Link href={`/search?tags=${notification.body.tag_label}`}>
              <PostUtil.Tag
                color={notification.body.tag_label && Utils.generateRandomColor(notification.body.tag_label)}
                clicked={false}
                boxShadow={false}
              >
                {Utils.minifyText(String(notification.body.tag_label), 10)}
              </PostUtil.Tag>
            </Link>
          )}
          {postLink && (
            <Link href={postLink}>
              <Typography.Body variant="small-bold" className="text-white text-opacity-80 hover:text-opacity-100">
                View Post
              </Typography.Body>
            </Link>
          )}
          {replyLink && parentPostReplyLink && (
            <>
              <Link href={replyLink}>
                <Typography.Body variant="small-bold" className="text-white text-opacity-80 hover:text-opacity-100">
                  View Reply
                </Typography.Body>
              </Link>
              <Typography.Body variant="small">{' - '}</Typography.Body>
              <Link href={parentPostReplyLink}>
                <Typography.Body variant="small-bold" className="text-white text-opacity-80 hover:text-opacity-100">
                  View Post
                </Typography.Body>
              </Link>
            </>
          )}
          {repostLink && embedLink && (
            <>
              <Link href={repostLink}>
                <Typography.Body variant="small-bold" className="text-white text-opacity-80 hover:text-opacity-100">
                  View Repost
                </Typography.Body>
              </Link>
              <Typography.Body variant="small">{' - '}</Typography.Body>
              <Link href={embedLink}>
                <Typography.Body variant="small-bold" className="text-white text-opacity-80 hover:text-opacity-100">
                  View Post
                </Typography.Body>
              </Link>
            </>
          )}
          {notification.body.type === notificationType?.post_deleted?.type && deletedPostLink && (
            <Link href={deletedPostLink}>
              <Typography.Body variant="small-bold" className="text-white text-opacity-80 hover:text-opacity-100">
                {notification.body.delete_source === 'reply' ||
                notification.body.delete_source === 'repost' ||
                notification.body.delete_source === 'tagged_post'
                  ? 'View Post'
                  : notification.body.delete_source === 'reply_parent'
                    ? 'View Reply'
                    : 'View Repost'}
              </Typography.Body>
            </Link>
          )}
          {notification.body.type === notificationType?.post_edited?.type && editedPostLink && (
            <>
              <Link href={editedPostLink}>
                <Typography.Body variant="small-bold" className="text-white text-opacity-80 hover:text-opacity-100">
                  View Post
                </Typography.Body>
              </Link>
              {linkedPostLink && notification.body.edit_source === 'reply_parent' && (
                <>
                  <Typography.Body variant="small">{' - '}</Typography.Body>
                  <Link href={linkedPostLink}>
                    <Typography.Body variant="small-bold" className="text-white text-opacity-80 hover:text-opacity-100">
                      View Reply
                    </Typography.Body>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="grow shrink basis-0 h-8 flex-col justify-center items-end gap-1 inline-flex">
        <div className="flex gap-2 md:gap-4 items-center">
          <Typography.Caption className="uppercase font-bold items-center flex gap-1 md:gap-2 text-white/30">
            {Utils.timeAgo(notification.timestamp, isMobile)}
          </Typography.Caption>
          <div className="relative">
            <div>{currentNotificationType.icon}</div>
            {unread && (
              <div id="notification-unread-dot" className="absolute bottom-0.5 right-0">
                <div className="w-3 h-3 bg-[#C8FF00] rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
