'use client';

import { Alert, Icon } from '@social/ui-shared';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeAlert, selectAlerts } from '@/store/slices/alerts';

const iconToShow = (variant: 'default' | 'warning') => {
  switch (variant) {
    case 'warning':
      return <Icon.Warning size="20" />;
    case 'default':
    default:
      return <Icon.CheckCircle size="20" color="#c8ff00" />;
  }
};

export default function Alerts() {
  const isMobile = useIsMobile();
  const alerts = useAppSelector(selectAlerts);
  const dispatch = useAppDispatch();

  // Remove alerts after 5 seconds
  useEffect(() => {
    alerts.forEach((alert: { id: number }) => {
      const timer = setTimeout(() => {
        dispatch(removeAlert(alert.id));
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [alerts, dispatch]);

  if (alerts.length === 0) return null;

  return (
    <div
      style={{ bottom: isMobile ? '96px' : '24px' }}
      className="fixed z-max left-1/2 transform -translate-x-1/2 flex flex-col gap-2"
    >
      {alerts.map(({ id, content, variant }) => (
        <Alert.Message key={id} icon={iconToShow(variant)} variant={variant}>
          {content}
        </Alert.Message>
      ))}
    </div>
  );
}
