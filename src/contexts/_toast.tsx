'use client';

import { Toast } from '@/components';
import { Icon } from '@social/ui-shared';
import { ReactNode, createContext, useContext, useState } from 'react';

export type ToastVariant = 'bookmark' | 'pubky' | 'warning' | 'link' | 'text';

type ToastMessage = {
  id: number;
  content: ReactNode;
  variant?: ToastVariant;
  title?: string;
};

type ToastContextType = {
  addToast: (content: React.ReactNode, variant?: ToastVariant, title?: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  addToast: () => {}
});

export function ToastWrapper({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (content: React.ReactNode, variant: ToastVariant = 'link', title?: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, content, variant, title }]);

    setTimeout(() => {
      setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, closing: true } : toast)));

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 300);
    }, 4000);
  };

  const iconToShow = (variant: ToastVariant) => {
    switch (variant) {
      case 'bookmark':
        return <Icon.BookmarkSimple size="24" opacity={1} color="#c8ff00" />;
      case 'pubky':
        return <Icon.Key size="24" color="#c8ff00" />;
      case 'warning':
        return <Icon.Warning size="24" color="#c8ff00" />;
      case 'text':
        return <Icon.FileText size="24" color="#c8ff00" />;
      case 'link':
      default:
        return <Icon.Link size="24" color="#c8ff00" />;
    }
  };

  const titleToShow = (variant: ToastVariant) => {
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
      {toasts.map(({ id, content, variant = 'link', title }) => (
        <Toast key={id} icon={iconToShow(variant)} title={title || titleToShow(variant)} variant={variant}>
          {content}
        </Toast>
      ))}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
}
