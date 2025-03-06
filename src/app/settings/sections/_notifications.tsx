'use client';

import { useEffect } from 'react';
import { usePubkyClientContext } from '@/contexts';
import { Icon, Input, Typography } from '@social/ui-shared';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectPreferences,
  togglePreference,
  setPreferences,
  NotificationPreferences
} from '@/store/slices/notifications';

type NotificationType = keyof NotificationPreferences;

export default function Notifications() {
  const { saveSettings, loadSettings } = usePubkyClientContext();
  const dispatch = useAppDispatch();
  const preferences = useAppSelector(selectPreferences);

  const handleLoadSettings = async () => {
    const result = await loadSettings();
    if (result) {
      dispatch(setPreferences(result.notifications));
    } else {
      saveSettings(preferences);
    }
  };

  useEffect(() => {
    handleLoadSettings();
  }, []);

  const handleToggle = (type: NotificationType) => {
    dispatch(togglePreference(type));
    saveSettings({ ...preferences, [type]: !preferences[type] });
  };

  return (
    <div className="p-8 md:p-12 bg-white bg-opacity-10 rounded-lg flex-col justify-start items-start gap-12 inline-flex">
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.BellSimple size="24" />
          <Typography.H2>Platform notifications</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Please select which notifications you want to receive on Pubky.
        </Typography.Body>
        <div className="w-full p-6 bg-white bg-opacity-5 shadow-[0px_20px_40px_0px_rgba(5,5,10,0.50)] rounded-2xl flex-col justify-start items-start gap-6 inline-flex">
          {Object.keys(preferences).map((type) => (
            <div key={type} className="w-full h-8 justify-between items-center inline-flex">
              <Typography.Body variant="small-bold">{getNotificationLabel(type as NotificationType)}</Typography.Body>
              <Input.Switch
                checked={preferences[type as NotificationType]}
                onChange={() => handleToggle(type as NotificationType)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getNotificationLabel = (type: NotificationType) => {
  switch (type) {
    case 'follow':
      return 'New follower';
    case 'new_friend':
      return 'New friend';
    case 'lost_friend':
      return 'Lost friend';
    case 'tag_post':
      return 'Someone tagged your post';
    case 'tag_profile':
      return 'Someone tagged your profile';
    case 'mention':
      return 'Someone mentioned your profile';
    case 'reply':
      return 'New reply to your post';
    case 'repost':
      return 'New repost to your post';
    case 'post_deleted':
      return 'Someone deleted a post you replied/reposted';
    case 'post_edited':
      return 'Someone edited a post you replied/reposted';
    default:
      return '';
  }
};
