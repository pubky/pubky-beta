'use client';

import { Toast } from '@/components';
import { Icon } from '@social/ui-shared';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type ToastContextType = {
  icon: ReactNode;
  content: ReactNode;
  show: boolean;
  setIcon: (icon: string) => void;
  setContent: (
    content: React.ReactNode,
    variant?: 'bookmark' | 'pubky' | 'link' | 'text'
  ) => void;
  setShow: (show: boolean) => void;
};

const ToastContext = createContext<ToastContextType>({
  icon: '',
  content: null,
  show: false,
  setIcon: () => {},
  setContent: () => {},
  setShow: () => {},
});

export function ToastWrapper({ children }: { children: React.ReactNode }) {
  const [icon, setIcon] = useState('');
  const [content, setContent] = useState<React.ReactNode>();
  const [variant, setVariant] = useState<
    'bookmark' | 'pubky' | 'link' | 'text'
  >('link');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setShow(false), 2000);
    }
  }, [show]);

  const handleSetContent = (
    content: React.ReactNode,
    variant: 'bookmark' | 'pubky' | 'link' | 'text' = 'link'
  ) => {
    setContent(content);
    setVariant(variant);
  };

  const iconToShow = (() => {
    switch (variant) {
      case 'bookmark':
        return <Icon.BookmarkSimple size="24" opacity={1} color="white" />;
      case 'pubky':
        return <Icon.Key size="24" />;
      case 'text':
        return <Icon.FileText size="24" />;
      case 'link':
      default:
        return <Icon.Link size="24" />;
    }
  })();

  const titleToShow = (() => {
    switch (variant) {
      case 'bookmark':
        return 'Save as bookmark';
      case 'pubky':
        return 'Pubky copied to clipboard';
      case 'text':
        return 'Text copied to clipboard';
      case 'link':
      default:
        return 'Link copied to clipboard';
    }
  })();

  return (
    <ToastContext.Provider
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
        <Toast icon={iconToShow} title={titleToShow} variant={variant}>
          {content}
        </Toast>
      )}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
}
