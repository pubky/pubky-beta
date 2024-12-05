'use client';

import { Toast } from '@/components';
import { Icon } from '@social/ui-shared';
import { ReactNode, createContext, useContext, useState } from 'react';

type ToastMessage = {
  id: number;
  content: ReactNode;
  variant?: 'bookmark' | 'pubky' | 'link' | 'text';
};

type ToastContextType = {
  addToast: (
    content: React.ReactNode,
    variant?: 'bookmark' | 'pubky' | 'link' | 'text',
  ) => void;
};

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
});

export function ToastWrapper({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    content: React.ReactNode,
    variant: 'bookmark' | 'pubky' | 'link' | 'text' = 'link',
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, content, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  };

  const iconToShow = (variant: 'bookmark' | 'pubky' | 'link' | 'text') => {
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
  };

  const titleToShow = (variant: 'bookmark' | 'pubky' | 'link' | 'text') => {
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
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.map(({ id, content, variant = 'link' }) => (
        <Toast
          key={id}
          icon={iconToShow(variant)}
          title={titleToShow(variant)}
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
