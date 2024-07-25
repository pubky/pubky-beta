import { useState, useEffect } from 'react';
import { Button, Icon, PostUtil, Typography } from '@social/ui-shared';
import { INotification, IUserProfile } from '@/types';
import { useClientContext } from '@/contexts';
import Link from 'next/link';
import Image from 'next/image';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';

interface NotificationTagGroupProps {
  group: INotification[];
}

export default function NotificationTagGroup({
  group,
}: NotificationTagGroupProps) {
  const { getUser } = useClientContext();
  const [users, setUsers] = useState<IUserProfile[]>([]);
  const router = useRouter();
  const notificationType = group[0].type;

  useEffect(() => {
    const fetchProfiles = async () => {
      const userIds = group
        .map((notification) => notification.body.taggedBy)
        .filter((userId): userId is string => !!userId);

      const userProfiles = await Promise.all(
        userIds.map((userId) => getUser(userId))
      );

      const uniqueUsers = Array.from(
        new Map(
          userProfiles
            .filter((profile): profile is IUserProfile => !!profile)
            .map((user) => [user.userId, user])
        ).values()
      );

      setUsers(uniqueUsers);
    };

    if (notificationType === 'tag_profile' || notificationType === 'tag_post') {
      fetchProfiles();
    }
  }, [group, getUser, notificationType]);

  const tagsByUserAndPost: {
    [key: string]: { tags: string[]; postUri?: string };
  } = {};

  group.forEach((notification) => {
    const taggedBy = notification.body.taggedBy;
    const tag = notification.body.tag;
    const postUri = notification.body.postUri;

    if (taggedBy && tag) {
      const key = `${taggedBy}-${postUri || ''}`;
      if (!tagsByUserAndPost[key]) {
        tagsByUserAndPost[key] = { tags: [], postUri };
      }
      tagsByUserAndPost[key].tags.push(tag);
    }
  });

  return (
    <>
      {Object.keys(tagsByUserAndPost).map((key, index) => {
        const [userId, postUri] = key.split('-');
        const { tags } = tagsByUserAndPost[key];
        const user = users.find((u) => u.userId === userId);
        const lastNotificationTimestamp = group[group.length - 1].timestamp;
        const postLink = postUri ? Utils.encodePostUri(postUri) : null;

        if (!user) return null;

        return (
          <div
            key={index}
            className="p-3 border-b border-white border-opacity-10 justify-between items-start flex flex-row"
          >
            <div className="flex gap-4 items-center">
              <Button.Action
                size="small"
                variant="custom"
                icon={<Icon.UserPlus size="16" />}
                className="bg-gradient-none border border-white border-opacity-30"
                disabled
              />
              <div className="flex items-center gap-2">
                <Image
                  width={32}
                  height={32}
                  className="max-w-none w-[32px] h-[32px] rounded-full shadow justify-center items-center flex"
                  alt={`user-${user.userId}`}
                  src={user.profile.image || '/images/Userpic.png'}
                />
                <Typography.Body variant="medium-bold">
                  <Link
                    href={`/profile/${user.userId}`}
                    className="hover:underline"
                  >
                    {Utils.minifyText(user?.profile?.name, 15)}
                  </Link>{' '}
                  <span className="text-white text-opacity-50">
                    tagged your{' '}
                    {notificationType === 'tag_profile' ? 'profile' : 'post'}{' '}
                    with{' '}
                  </span>
                </Typography.Body>
                <div className="flex-wrap flex gap-2">
                  {tags.map((tag, tagIndex) => (
                    <PostUtil.Tag
                      key={tagIndex}
                      color={Utils.generateRandomColor(tag)}
                      onClick={() => router.push(`/search?tags=${tag}`)}
                      clicked={false}
                    >
                      {tag}
                    </PostUtil.Tag>
                  ))}
                </div>
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
              </div>
            </div>
            <div className="grow shrink basis-0 flex-col justify-center items-end gap-1 inline-flex">
              <Typography.Caption className="items-center flex gap-2 text-white text-opacity-50">
                <Icon.Clock size="13" color="gray" />
                {lastNotificationTimestamp &&
                  Utils.timeAgo(lastNotificationTimestamp)}
              </Typography.Caption>
            </div>
          </div>
        );
      })}
    </>
  );
}