import { ReactNode } from 'react';
import { useAppDispatch } from '@/store';
import { addAlert } from '@/store/slices/alerts';

export function useAlert() {
  const dispatch = useAppDispatch();

  const showAlert = (content: ReactNode, variant: 'default' | 'warning' = 'default') => {
    dispatch(addAlert({ content, variant }));
  };

  return { addAlert: showAlert };
}
