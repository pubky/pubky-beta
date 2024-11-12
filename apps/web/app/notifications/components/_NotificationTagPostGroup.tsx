import { useState, useEffect } from 'react';
import { Utils } from '@social/utils-shared';
import { Icon, Typography, Button, PostUtil } from '@social/ui-shared';
import { INotification, IUserProfile } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageByUri } from '@/components/ImageByUri';

type NotificationTagPostGroupProps = {
  notifications: INotification[];
};

export default function NotificationTagPostGroup({
  notifications,
}: NotificationTagPostGroupProps) {
  //const { getUser } = useClientContext();
  const [user, setUser] = useState<IUserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = null; // await getUser(notifications[0].body.taggedBy!);
        if (userProfile) {
          setUser(userProfile);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, [notifications]);

  const postUrl = notifications[0].body.postUri;

  return (
    <div className="p-3 border-b border-white border-opacity-10 justify-between items-start flex flex-row">
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button.Action
          size="small"
          variant="custom"
          icon={<Icon.Tag size="16" />}
          className="bg-gradient-none border border-white border-opacity-30"
          disabled
        />
        <div className="flex gap-2 items-center flex-wrap">
          {!user ? (
            <Typography.Body variant="medium-bold">Loading...</Typography.Body>
          ) : (
            <Link
              href={`/profile/${user.userId}`}
              className="flex gap-2 items-center"
            >
              <ImageByUri
                width={32}
                height={32}
                className="w-[32px] h-[32px] rounded-full"
                alt="user-pic"
                uri={user.profile.image || '/images/webp/Userpic.webp'}
              />
              <Typography.Body
                className="hover:underline hover:decoration-solid"
                variant="medium-bold"
              >
                {Utils.minifyText(user.profile.name, 20)}
              </Typography.Body>
            </Link>
          )}
          <Typography.Body variant="medium-bold" className="text-opacity-50">
            tagged your post as
          </Typography.Body>
          {notifications.map((notification, index) => (
            <div key={index} className="flex gap-2 items-center flex-wrap">
              <PostUtil.Tag
                color={
                  notification.body.tag &&
                  Utils.generateRandomColor(notification.body.tag)
                }
                onClick={() =>
                  router.push(`/search?tags=${notification.body.tag}`)
                }
                clicked={false}
                boxShadow={false}
              >
                {notification.body.tag}
              </PostUtil.Tag>
            </div>
          ))}
          {postUrl && (
            <Link href={Utils.encodePostUri(postUrl)}>
              <Typography.Body
                variant="small"
                className="text-white text-opacity-80 hover:text-opacity-100"
              >
                View post
              </Typography.Body>
            </Link>
          )}
        </div>
      </div>
      <div className="grow shrink basis-0 h-8 flex-col justify-center items-end gap-1 inline-flex opacity-30">
        <Typography.Caption className="uppercase items-center flex gap-2 text-white">
          <Icon.Clock size="13" />
          {Utils.timeAgo(notifications[0].timestamp)}
        </Typography.Caption>
      </div>
    </div>
  );
}
