'use client';

import { Card } from '../Card';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface RootModalProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  closeModal?: () => void;
  children?: React.ReactNode;
}

export const Root = ({
  show = false,
  closeModal,
  children,
  ...rest
}: RootModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal?.();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, closeModal]);

  return (
    <div className="flex justify-center items-center">
      {show && (
        <div
          className={twMerge(
            `fixed top-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center`,
            rest.className
          )}
        >
          <div ref={modalRef}>
            <Card.Primary className="w-full h-full p-12 bg-gradient-to-b from-stone-950 to-black rounded-2xl shadow border border-fuchsia-500 border-opacity-30 flex-col justify-start items-start gap-12 inline-flex">
              {children}
            </Card.Primary>
          </div>
        </div>
      )}
    </div>
  );
};
