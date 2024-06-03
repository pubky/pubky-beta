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
  setContent: (content: string) => void;
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
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setShow(false), 5000);
    }
  }, [show]);

  return (
    <AlertContext.Provider
      value={{
        icon,
        content,
        show,
        setContent,
        setIcon,
        setShow,
      }}
    >
      {children}
      {show && (
        <Alert.Message icon={<Icon.CheckCircle size="20" />}>
          {content}
        </Alert.Message>
      )}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  return useContext(AlertContext);
}
