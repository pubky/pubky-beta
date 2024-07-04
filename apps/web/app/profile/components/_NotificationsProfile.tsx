import { Notifications } from '@/app/notifications/components';
import { useNotificationsContext } from '@/contexts';
import { Button, Icon } from '@social/ui-shared';
import Link from 'next/link';

export default function NotificationsProfile() {
  const { notifications } = useNotificationsContext();
  return (
    <>
      {notifications.length > 0 && (
        <div>
          {notifications.slice(0, 2).map((notification, index) => (
            <Notifications.Notification
              key={index}
              notification={notification}
            />
          ))}
          <Link href={'/notifications'}>
            <Button.Medium
              icon={<Icon.Bell size="16" />}
              //variant="secondary"
              className="mt-4 mb-8 md:w-[30%]"
            >
              Show Notifications
            </Button.Medium>
          </Link>
        </div>
      )}
    </>
  );
}
