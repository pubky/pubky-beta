'use client';

import { Toast } from './../Toast';
import { Icon } from '@social/ui-shared';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeToast, selectToasts, ToastVariant } from '@/store/slices/toasts';

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

export default function Toasts() {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();

  // Remove toasts after 2 seconds
  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 2000);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <>
      {toasts.map(({ id, content, variant = 'link', title }) => (
        <Toast key={id} icon={iconToShow(variant)} title={title || titleToShow(variant)} variant={variant}>
          {content}
        </Toast>
      ))}
    </>
  );
}
