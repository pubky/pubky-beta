'use client';

import { Toast } from '@/components';
import { Icon } from '@social/ui-shared';
import { ReactNode, createContext, useContext, useState } from 'react';

type ToastMessage = {
  id: number;
  content: ReactNode;
  title?: string;
  variant?: 'bookmark' | 'pubky' | 'warning' | 'link' | 'text';
};

type ToastContextType = {
  addToast: (
    content: React.ReactNode,
    title?: string,
    variant?: 'bookmark' | 'pubky' | 'warning' | 'link' | 'text',
  ) => void;
};

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
});

export function ToastWrapper({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    content: React.ReactNode,
    title?: string,
    variant: 'bookmark' | 'pubky' | 'warning' | 'link' | 'text' = 'link',
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, content, title, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  };

  const iconToShow = (
    variant: 'bookmark' | 'pubky' | 'warning' | 'link' | 'text',
  ) => {
    switch (variant) {
      case 'bookmark':
        return <Icon.BookmarkSimple size="24" opacity={1} color="white" />;
      case 'pubky':
        return <Icon.Key size="24" />;
      case 'warning':
        return <Icon.Warning size="24" />;
      case 'text':
        return <Icon.FileText size="24" />;
      case 'link':
      default:
        return <Icon.Link size="24" />;
    }
  };

  const titleToShow = (
    variant: 'bookmark' | 'pubky' | 'warning' | 'link' | 'text',
  ) => {
    switch (variant) {
      case 'bookmark':
        return 'Save as bookmark';
      case 'pubky':
        return 'Pubky copied to clipboard';
      case 'warning':
        return 'Warning!';
      case 'text':
        return 'Text copied to clipboard';
      case 'link':
      default:
        return 'Link copied to clipboard';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.map(({ id, content, title, variant = 'link' }) => (
        <Toast
          key={id}
          icon={iconToShow(variant)}
          title={title || titleToShow(variant)}
          variant={variant}
        >
          {content}
        </Toast>
      ))}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
}
