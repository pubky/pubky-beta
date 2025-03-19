'use client';

import { useEffect } from 'react';
import { Card } from '../Card';
import { twMerge } from 'tailwind-merge';

interface RootModalProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  closeModal: () => void;
  children?: React.ReactNode;
}

const modalStack: (() => void)[] = [];

const handleGlobalKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && modalStack.length > 0) {
    const lastCloseModal = modalStack.pop();
    lastCloseModal?.();
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleGlobalKeyDown);
}

export const Root = ({ show = false, closeModal, children, ...rest }: RootModalProps) => {
  useEffect(() => {
    if (show) {
      modalStack.push(closeModal);
    }

    return () => {
      const index = modalStack.indexOf(closeModal);
      if (index !== -1) {
        modalStack.splice(index, 1);
      }
    };
  }, [show, closeModal]);

  if (!show) return null;

  return (
    <div className="flex justify-center items-center">
      <div
        onClick={closeModal}
        className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div id="modal-root" onClick={(e) => e.stopPropagation()}>
          <Card.Primary
            background="bg-[#05050A] opacity-100"
            className={twMerge(
              `w-full h-full p-12 rounded-2xl shadow border border-white border-opacity-30 inline-flex flex-col`,
              rest.className
            )}
          >
            {children}
          </Card.Primary>
        </div>
      </div>
    </div>
  );
};
