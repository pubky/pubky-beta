import { useState, useEffect } from 'react';
import { Utils } from '@social/utils-shared';
import { Icon, Typography, Button, PostUtil } from '@social/ui-shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageByUri } from '@/components/ImageByUri';
import { getUserProfile } from '@/services/userService';
import { usePubkyClientContext } from '@/contexts';
import { NotificationView, UserView } from '@/types/User';

const notificationType = {
  follow: {
    type: 'follow',
    icon: <Icon.UserPlus size="16" />,
    text: 'followed you',
  },
  newfriend: {
    type: 'newfriend',
    icon: <Icon.UsersLeft size="16" />,
    text: 'is your friend now',
  },
  lostfriend: {
    type: 'lostfriend',
    icon: <Icon.UserMinus size="16" />,
    text: 'is not your friend anymore',
  },
  tagpost: {
    type: 'tagpost',
    icon: <Icon.Tag size="16" />,
    text: 'tagged your post as',
  },
  tagprofile: {
    type: 'tagprofile',
    icon: <Icon.Tag size="16" />,
    text: 'tagged your profile as',
  },
  reply: {
    type: 'reply',
    icon: <Icon.ChatCircleText size="16" />,
    text: 'replied your post',
  },
  repost: {
    type: 'repost',
    icon: <Icon.Repost size="16" />,
    text: 'reposted your post',
  },
  mention: {
    type: 'mention',
    icon: <Icon.Note size="16" />,
    text: 'mentioned you in a post',
  },
  postdeleted: {
    type: 'postdeleted',
    icon: <Icon.Trash size="16" />,
    text: 'deleted a post',
  },
};

type NotificationTypeKey = keyof typeof notificationType;

export default function Notification({
  notification,
}: {
  notification: NotificationView;
}) {
  const router = useRouter();
  const { pubky } = usePubkyClientContext();
  const [user, setUser] = useState<UserView>();

  async function fetchProfile(userId: string) {
    try {
      const userProfile = await getUserProfile(userId, pubky ?? '');
      if (userProfile) {
        setUser(userProfile);
      } else {
        setUser(undefined);
      }
    } catch (error) {
      console.log(error);
      setUser(undefined);
    }
  }

  useEffect(() => {
    let userId: string | undefined;
    if (
      notification.body.type === notificationType?.follow?.type ||
      notification.body.type === notificationType?.newfriend?.type ||
      notification.body.type === notificationType?.lostfriend?.type
    ) {
      userId = notification.body.followed_by || notification.body.unfollowed_by;
    } else if (
      notification.body.type === notificationType?.tagprofile?.type ||
      notification.body.type === notificationType?.tagpost?.type
    ) {
      userId = notification.body.tagged_by;
    } else if (notification.body.type === notificationType?.reply?.type) {
      userId = notification.body.replied_by;
    } else if (notification.body.type === notificationType?.repost?.type) {
      userId = notification.body.reposted_by;
    } else if (notification.body.type === notificationType?.mention?.type) {
      userId = notification.body.mentioned_by;
    } else if (notification.body.type === notificationType?.postdeleted?.type) {
      userId = notification.body.deleted_by;
    }

    if (userId) {
      fetchProfile(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]);

  const currentNotificationType =
    notificationType[notification?.body?.type as NotificationTypeKey];

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
    notification?.body?.deleted_by;

  const postLink =
    (notification?.body?.type === notificationType?.tagpost?.type ||
      notification?.body?.type === notificationType?.mention?.type) &&
    notification.body.post_uri
      ? Utils.encodePostUri(notification.body.post_uri)
      : '';

  const replyLink =
    notification?.body?.type === notificationType?.reply?.type &&
    notification.body.reply_uri
      ? Utils.encodePostUri(notification.body.reply_uri)
      : '';

  const parentPostReplyLink =
    notification.body.type === notificationType?.reply?.type &&
    notification.body.parent_post_uri
      ? Utils.encodePostUri(notification.body.parent_post_uri)
      : '';

  const repostLink =
    notification.body.type === notificationType?.repost?.type &&
    notification.body.repost_uri
      ? Utils.encodePostUri(notification.body.repost_uri)
      : '';

  const embedLink =
    notification.body.type === notificationType?.repost?.type &&
    notification.body.embed_uri
      ? Utils.encodePostUri(notification.body.embed_uri)
      : '';

  const deletedPostLink =
    (notification.body.delete_type === 'ReplyParent' ||
      notification.body.delete_type === 'RepostEmbed') &&
    notification.body.linked_uri
      ? Utils.encodePostUri(notification.body.linked_uri)
      : '';

  return (
    <div className="p-3 border-b border-white border-opacity-10 justify-between items-start flex flex-row">
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button.Action
          size="small"
          variant="custom"
          icon={currentNotificationType.icon}
          className="bg-gradient-none border border-white border-opacity-30"
          disabled
        />
        <div className="flex gap-2 items-center">
          {userId && (
            <Link
              href={`/profile/${userId}`}
              className="flex gap-2 items-center"
            >
              {user && (
                <ImageByUri
                  width={32}
                  height={32}
                  className="w-[32px] h-[32px] rounded-full"
                  alt="user-pic"
                  uri={user?.details?.image || '/images/Userpic.png'}
                />
              )}
              <Typography.Body
                className="hover:underline hover:decoration-solid"
                variant="medium-bold"
              >
                {user !== undefined
                  ? user
                    ? Utils.minifyText(user?.details?.name, 20)
                    : 'Loading...'
                  : '[DELETED]'}
              </Typography.Body>
            </Link>
          )}
          <Typography.Body variant="medium-bold" className="text-opacity-50">
            {currentNotificationType.text}
            {notification.body.type === notificationType?.postdeleted?.type &&
              (notification.body.delete_type === 'ReplyParent'
                ? ' you replied'
                : ' you reposted')}
          </Typography.Body>
          {(notification.body.type === notificationType?.tagprofile?.type ||
            notification.body.type === notificationType?.tagpost?.type) && (
            <PostUtil.Tag
              color={
                notification.body.tag_label &&
                Utils.generateRandomColor(notification.body.tag_label)
              }
              onClick={() =>
                router.push(`/search?tags=${notification.body.tag_label}`)
              }
              clicked={false}
              boxShadow={false}
            >
              {notification.body.tag_label}
            </PostUtil.Tag>
          )}
          {postLink && (
            <Link href={postLink}>
              <Typography.Body
                variant="small"
                className="text-white text-opacity-80 hover:text-opacity-100"
              >
                View post
              </Typography.Body>
            </Link>
          )}
          {replyLink && parentPostReplyLink && (
            <>
              <Link href={replyLink}>
                <Typography.Body
                  variant="small"
                  className="text-white text-opacity-80 hover:text-opacity-100"
                >
                  View Reply
                </Typography.Body>
              </Link>
              <Typography.Body variant="small">{' - '}</Typography.Body>
              <Link href={parentPostReplyLink}>
                <Typography.Body
                  variant="small"
                  className="text-white text-opacity-80 hover:text-opacity-100"
                >
                  View Post
                </Typography.Body>
              </Link>
            </>
          )}
          {repostLink && embedLink && (
            <>
              <Link href={repostLink}>
                <Typography.Body
                  variant="small"
                  className="text-white text-opacity-80 hover:text-opacity-100"
                >
                  View Repost
                </Typography.Body>
              </Link>
              <Typography.Body variant="small">{' - '}</Typography.Body>
              <Link href={embedLink}>
                <Typography.Body
                  variant="small"
                  className="text-white text-opacity-80 hover:text-opacity-100"
                >
                  View Post
                </Typography.Body>
              </Link>
            </>
          )}
          {notification.body.type === notificationType?.postdeleted?.type &&
            deletedPostLink && (
              <Link href={deletedPostLink}>
                <Typography.Body
                  variant="small"
                  className="text-white text-opacity-80 hover:text-opacity-100"
                >
                  {notification.body.delete_type === 'ReplyParent'
                    ? 'View reply'
                    : 'View repost'}
                </Typography.Body>
              </Link>
            )}
        </div>
      </div>
      <div className="grow shrink basis-0 h-8 flex-col justify-center items-end gap-1 inline-flex opacity-30">
        <Typography.Caption className="uppercase items-center flex gap-2 text-white">
          <Icon.Clock size="16" />
          {Utils.timeAgo(notification.timestamp)}
        </Typography.Caption>
      </div>
    </div>
  );
}
