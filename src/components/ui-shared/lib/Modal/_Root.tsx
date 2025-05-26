'use client';

import { useEffect } from 'react';
import { Card } from '../Card';
import { twMerge } from 'tailwind-merge';

interface RootModalProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  closeModal: () => void;
  children?: React.ReactNode;
  fixed?: boolean;
}

const modalStack: { closeModal: () => void; fixed?: boolean }[] = [];

const handleGlobalKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && modalStack.length > 0) {
    const lastModal = modalStack[modalStack.length - 1];
    if (!lastModal.fixed) {
      modalStack.pop(); // Remove it first
      lastModal.closeModal(); // Then call closeModal
    }
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleGlobalKeyDown);
}

export const Root = ({ show = false, closeModal, children, fixed = false, ...rest }: RootModalProps) => {
  useEffect(() => {
    if (show) {
      // Add to stack with its fixed status
      modalStack.push({ closeModal, fixed });
    }

    return () => {
      // Remove from stack when component unmounts or show/closeModal/fixed changes
      const index = modalStack.findIndex((item) => item.closeModal === closeModal);
      if (index !== -1) {
        modalStack.splice(index, 1);
      }
    };
  }, [show, closeModal, fixed]); // Add fixed to dependency array

  if (!show) return null;

  return (
    <div className="flex justify-center items-center">
      <div
        onClick={fixed ? undefined : closeModal}
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
