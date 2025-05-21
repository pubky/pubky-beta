'use client';

import { Alert, Icon } from '@social/ui-shared';
import { useIsMobile } from '@/hooks/useIsMobile';
import { createContext, useContext, useState, ReactNode } from 'react';

type AlertMessage = {
  id: number;
  content: ReactNode;
  variant?: 'default' | 'warning' | 'connection';
  persistent?: boolean;
  isOnline?: boolean;
};

type AlertContextType = {
  addAlert: (content: ReactNode, variant?: 'default' | 'warning') => void;
  connectionAlertStatus: (isOnline: boolean) => void;
};

const AlertContext = createContext<AlertContextType>({
  addAlert: () => {},
  connectionAlertStatus: () => {}
});

export function AlertWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const addAlert = (content: ReactNode, variant: 'default' | 'warning' = 'default') => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, content, variant }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 5000);
  };

  const connectionAlertStatus = (isOnline: boolean) => {
    // Remove any existing connection alerts
    setAlerts((prev) => prev.filter((alert) => alert.variant !== 'connection'));

    const content = isOnline ? 'Internet connection restored' : 'No internet connection';
    const id = Date.now();

    setAlerts((prev) => [
      ...prev,
      {
        id,
        content,
        variant: 'connection',
        persistent: !isOnline,
        isOnline
      }
    ]);

    if (isOnline) {
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, 3000);
    }
  };

  const iconToShow = (variant: 'default' | 'warning' | 'connection', isOnline?: boolean) => {
    switch (variant) {
      case 'warning':
        return <Icon.Warning size="20" />;
      case 'connection':
        return isOnline ? <Icon.CheckCircle size="20" color="#c8ff00" /> : <Icon.LoadingSpin size="20" color='#e95164' />;
      case 'default':
      default:
        return <Icon.CheckCircle size="20" color="#c8ff00" />;
    }
  };

  return (
    <AlertContext.Provider value={{ addAlert, connectionAlertStatus }}>
      {children}
      <div
        style={{ bottom: isMobile ? '96px' : '24px' }}
        className="fixed z-max left-1/2 transform -translate-x-1/2 flex flex-col gap-2"
      >
        {alerts.map(({ id, content, variant = 'default', isOnline }) => (
          <Alert.Message
            key={id}
            icon={iconToShow(variant, isOnline)}
            variant={variant}
            isOnline={isOnline}
          >
            {content}
          </Alert.Message>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  return useContext(AlertContext);
}
