'use client';

import { Alert, Icon } from '@social/ui-shared';
import { useIsMobile } from '@/hooks/useIsMobile';
import { createContext, useContext, useState, ReactNode } from 'react';

type AlertMessage = {
  id: number;
  content: ReactNode;
  variant?: 'default' | 'warning' | 'connection' | 'homeserver' | 'loading';
  persistent?: boolean;
  isOnline?: boolean;
  isUp?: boolean;
  isLosingConnection?: boolean;
  onRetry?: () => void;
  isRetrying?: boolean;
};

type ConnectionStatus = 'waiting' | 'restored' | 'lost';

type AlertContextType = {
  addAlert: (content: ReactNode, variant?: 'default' | 'warning' | 'loading') => number;
  removeAlert: (id: number) => void;
  connectionAlertStatus: (status: ConnectionStatus) => void;
  homeserverAlertStatus: (isUp: boolean, onRetry?: () => void, isRetrying?: boolean) => void;
};

const AlertContext = createContext<AlertContextType>({
  addAlert: () => 0,
  removeAlert: () => {},
  connectionAlertStatus: () => {},
  homeserverAlertStatus: () => {}
});

export function AlertWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const addAlert = (content: ReactNode, variant: 'default' | 'warning' | 'loading' = 'default'): number => {
    const id = Date.now();
    const isPersistent = variant === 'loading';
    setAlerts((prev) => [...prev, { id, content, variant, persistent: isPersistent }]);

    // Only auto-remove if not persistent
    if (!isPersistent) {
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, 5000);
    }

    return id;
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const connectionAlertStatus = (status: ConnectionStatus) => {
    // Remove any existing connection alerts
    setAlerts((prev) => prev.filter((alert) => alert.variant !== 'connection'));

    let content: string;
    let isOnline: boolean;
    let isLosingConnection: boolean;
    let persistent: boolean;

    switch (status) {
      case 'restored':
        content = 'Internet connection restored';
        isOnline = true;
        isLosingConnection = false;
        persistent = false;
        break;
      case 'waiting':
        content = 'Reconnecting...';
        isOnline = false;
        isLosingConnection = true;
        persistent = true;
        break;
      case 'lost':
        content = 'No internet connection';
        isOnline = false;
        isLosingConnection = false;
        persistent = true;
        break;
    }

    const id = Date.now();

    setAlerts((prev) => [
      ...prev,
      {
        id,
        content,
        variant: 'connection',
        persistent,
        isOnline,
        isLosingConnection
      }
    ]);

    if (status === 'restored') {
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, 3000);
    }
  };

  const homeserverAlertStatus = (isUp: boolean, onRetry?: () => void, isRetrying?: boolean) => {
    // Remove any existing homeserver alerts
    setAlerts((prev) => prev.filter((alert) => alert.variant !== 'homeserver'));

    const content = isUp ? 'Homeserver restored' : 'Homeserver is down';
    const id = Date.now();

    setAlerts((prev) => [
      ...prev,
      {
        id,
        content,
        variant: 'homeserver',
        persistent: !isUp,
        isUp,
        onRetry: !isUp ? onRetry : undefined,
        isRetrying
      }
    ]);

    if (isUp) {
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, 3000);
    }
  };

  const iconToShow = (
    variant: 'default' | 'warning' | 'connection' | 'homeserver' | 'loading',
    isOnline?: boolean,
    isUp?: boolean,
    isLosingConnection?: boolean
  ) => {
    switch (variant) {
      case 'warning':
        return <Icon.Warning size="20" />;
      case 'loading':
        return <Icon.LoadingSpin size="20" />;
      case 'connection':
        if (isOnline) {
          return <Icon.CheckCircle size="20" color="#c8ff00" />;
        } else if (isLosingConnection) {
          return <Icon.LoadingSpin size="20" color="#fbbf24" />;
        } else {
          return <Icon.LoadingSpin size="20" color="#e95164" />;
        }
      case 'homeserver':
        return isUp ? <Icon.CheckCircle size="20" color="#c8ff00" /> : <Icon.LoadingSpin size="20" color="#e95164" />;
      case 'default':
      default:
        return <Icon.CheckCircle size="20" color="#c8ff00" />;
    }
  };

  return (
    <AlertContext.Provider value={{ addAlert, removeAlert, connectionAlertStatus, homeserverAlertStatus }}>
      {children}
      <div
        style={{ bottom: isMobile ? '96px' : '24px' }}
        className="fixed z-max left-1/2 transform -translate-x-1/2 flex flex-col gap-2"
      >
        {alerts.map(({ id, content, variant = 'default', isOnline, isUp, isLosingConnection, onRetry, isRetrying }) => (
          <Alert.Message
            key={id}
            icon={iconToShow(variant, isOnline, isUp, isLosingConnection)}
            variant={variant}
            isOnline={isOnline}
            isUp={isUp}
            isLosingConnection={isLosingConnection}
            onRetry={onRetry}
            isRetrying={isRetrying}
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
