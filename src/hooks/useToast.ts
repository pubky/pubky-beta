import { ReactNode } from 'react';
import { useAppDispatch } from '@/store';
import { addToast, ToastVariant } from '@/store/slices/toasts';

export function useToast() {
  const dispatch = useAppDispatch();

  const showToast = (content: ReactNode, variant: ToastVariant = 'link', title?: string) => {
    dispatch(addToast({ content, variant, title }));
  };

  return { addToast: showToast };
}
