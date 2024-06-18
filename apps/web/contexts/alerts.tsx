'use client';

import { Alert, Icon } from '@social/ui-shared';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type AlertContextType = {
  icon: ReactNode;
  content: string;
  show: boolean;
  setIcon: (icon: string) => void;
  setContent: (content: string, variant?: 'default' | 'warning') => void;
  setShow: (show: boolean) => void;
};

const AlertContext = createContext<AlertContextType>({
  icon: '',
  content: '',
  show: false,
  setIcon: () => {},
  setContent: () => {},
  setShow: () => {},
});

export function AlertWrapper({ children }: { children: React.ReactNode }) {
  const [icon, setIcon] = useState('');
  const [content, setContent] = useState('');
  const [variant, setVariant] = useState<'default' | 'warning'>('default');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setShow(false), 5000);
    }
  }, [show]);

  const handleSetContent = (
    content: string,
    variant: 'default' | 'warning' = 'default'
  ) => {
    setContent(content);
    setVariant(variant);
  };

  const iconToShow = (() => {
    switch (variant) {
      case 'warning':
        return <Icon.Warning size="20" />;
      case 'default':
      default:
        return <Icon.CheckCircle size="20" />;
    }
  })();

  return (
    <AlertContext.Provider
      value={{
        icon,
        content,
        show,
        setContent: handleSetContent,
        setIcon,
        setShow,
      }}
    >
      {children}
      {show && (
        <Alert.Message icon={iconToShow} variant={variant}>
          {content}
        </Alert.Message>
      )}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  return useContext(AlertContext);
}
