import { useState, useEffect } from 'react';
import { Utils } from '@social/utils-shared';
import { Icon, Typography, Button, PostUtil } from '@social/ui-shared';
import { useClientContext } from '@/contexts';
import { INotification, IUserProfile } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageByUri } from '@/components/ImageByUri';

const notificationType = {
  follow: {
    type: 'follow',
    icon: <Icon.UserPlus size="16" />,
    text: 'followed you',
  },
  new_friend: {
    type: 'new_friend',
    icon: <Icon.UsersLeft size="16" />,
    text: 'is your friend now',
  },
  lost_friend: {
    type: 'lost_friend',
    icon: <Icon.UserMinus size="16" />,
    text: 'is not your friend anymore',
  },
  tag_post: {
    type: 'tag_post',
    icon: <Icon.Tag size="16" />,
    text: 'tagged your post as',
  },
  tag_profile: {
    type: 'tag_profile',
    icon: <Icon.Tag size="16" />,
    text: 'tagged your profile as',
  },
  mention: {
    type: 'mention',
    icon: <Icon.Eye size="16" />,
    text: 'mentioned you in a post',
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
  post_deleted: {
    type: 'post_deleted',
    icon: <Icon.Trash size="16" />,
    text: 'deleted a post',
  },
};

type NotificationTypeKey = keyof typeof notificationType;

export default function Notification({
  notification,
}: {
  notification: INotification;
}) {
  const router = useRouter();
  const { getUser } = useClientContext();
  const [user, setUser] = useState<IUserProfile>();

  async function fetchProfile(userId: string) {
    try {
      const userProfile = await getUser(userId);
      if (userProfile) {
        setUser(userProfile);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let userId: string | undefined;
    if (
      notification.type === notificationType.follow.type ||
      notification.type === notificationType.new_friend.type ||
      notification.type === notificationType.lost_friend.type
    ) {
      userId = notification.body.followedBy || notification.body.unfollowedBy;
    } else if (
      notification.type === notificationType.tag_profile.type ||
      notification.type === notificationType.tag_post.type
    ) {
      userId = notification.body.taggedBy;
    } else if (notification.type === notificationType.reply.type) {
      userId = notification.body.repliedBy;
    } else if (notification.type === notificationType.repost.type) {
      userId = notification.body.repostedBy;
    } else if (notification.type === notificationType.mention.type) {
      userId = notification.body.mentionedBy;
    } else if (notification.type === notificationType.post_deleted.type) {
      userId = notification.body.deletedBy;
    }

    if (userId) {
      fetchProfile(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification, getUser]);

  const currentNotificationType =
    notificationType[notification.type as NotificationTypeKey];

  if (!currentNotificationType) {
    return null;
  }

  const userId =
    notification.body.followedBy ||
    notification.body.unfollowedBy ||
    notification.body.taggedBy ||
    notification.body.repliedBy ||
    notification.body.repostedBy ||
    notification.body.mentionedBy ||
    notification.body.deletedBy;

  const postLink =
    (notification.type === notificationType.tag_post.type ||
      notification.type === notificationType.mention.type) &&
    notification.body.postUri
      ? Utils.encodePostUri(notification.body.postUri)
      : '';

  const replyLink =
    notification.type === notificationType.reply.type &&
    notification.body.replyUri
      ? Utils.encodePostUri(notification.body.replyUri)
      : '';

  const parentPostReplyLink =
    notification.type === notificationType.reply.type &&
    notification.body.parentPostUri
      ? Utils.encodePostUri(notification.body.parentPostUri)
      : '';

  const repostLink =
    notification.type === notificationType.repost.type &&
    notification.body.repostUri
      ? Utils.encodePostUri(notification.body.repostUri)
      : '';

  const embedLink =
    notification.type === notificationType.repost.type &&
    notification.body.embedUri
      ? Utils.encodePostUri(notification.body.embedUri)
      : '';

  const deletedPostLink =
    (notification.body.deleteType === 'reply_parent' ||
      notification.body.deleteType === 'repost_embed') &&
    notification.body.linkedUri
      ? Utils.encodePostUri(notification.body.linkedUri)
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
                  uri={user?.profile?.image || '/images/Userpic.png'}
                />
              )}
              <Typography.Body
                className="hover:underline hover:decoration-solid"
                variant="medium-bold"
              >
                {user ? Utils.minifyText(user.profile.name, 20) : 'Loading...'}
              </Typography.Body>
            </Link>
          )}
          <Typography.Body variant="medium-bold" className="text-opacity-50">
            {currentNotificationType.text}
            {notification.type === notificationType.post_deleted.type &&
              (notification.body.deleteType === 'reply_parent'
                ? ' you replied'
                : ' you reposted')}
          </Typography.Body>
          {(notification.type === notificationType.tag_profile.type ||
            notification.type === notificationType.tag_post.type) && (
            <PostUtil.Tag
              color={
                notification.body.tag &&
                Utils.generateRandomColor(notification.body.tag)
              }
              onClick={() =>
                router.push(`/search?tags=${notification.body.tag}`)
              }
              clicked={false}
            >
              {notification.body.tag}
            </PostUtil.Tag>
          )}
          {postLink && (
            <Link href={postLink}>
              <Typography.Body
                variant="small"
                className="text-fuchsia-500 text-opacity-80 hover:text-opacity-100"
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
                  className="text-fuchsia-500 text-opacity-80 hover:text-opacity-100"
                >
                  View Reply
                </Typography.Body>
              </Link>
              <Typography.Body variant="small">{' - '}</Typography.Body>
              <Link href={parentPostReplyLink}>
                <Typography.Body
                  variant="small"
                  className="text-fuchsia-500 text-opacity-80 hover:text-opacity-100"
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
                  className="text-fuchsia-500 text-opacity-80 hover:text-opacity-100"
                >
                  View Repost
                </Typography.Body>
              </Link>
              <Typography.Body variant="small">{' - '}</Typography.Body>
              <Link href={embedLink}>
                <Typography.Body
                  variant="small"
                  className="text-fuchsia-500 text-opacity-80 hover:text-opacity-100"
                >
                  View Post
                </Typography.Body>
              </Link>
            </>
          )}
          {notification.type === notificationType.post_deleted.type &&
            deletedPostLink && (
              <Link href={deletedPostLink}>
                <Typography.Body
                  variant="small"
                  className="text-fuchsia-500 text-opacity-80 hover:text-opacity-100"
                >
                  {notification.body.deleteType === 'reply_parent'
                    ? 'View reply'
                    : 'View repost'}
                </Typography.Body>
              </Link>
            )}
        </div>
      </div>
      <div className="grow shrink basis-0 h-8 flex-col justify-center items-end gap-1 inline-flex">
        <Typography.Caption className="items-center flex gap-2 text-white text-opacity-50">
          <Icon.Clock size="13" color="gray" />
          {Utils.timeAgo(notification.timestamp)}
        </Typography.Caption>
      </div>
    </div>
  );
}
