import { Card } from '../Card';
import { useRef } from 'react';

interface RootModalProps {
  show: boolean;
  // closeModal?: () => void;
  children?: React.ReactNode;
}

export const Root = ({ show = false, children }: RootModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // function handleClickOutside(event: MouseEvent) {
  //   if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
  //     closeModal?.();
  //   }
  // }

  // document.addEventListener('mousedown', handleClickOutside);

  return (
    <div>
      {show && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
          <div ref={modalRef}>
            <Card.Primary className="w-full max-w-[1200px] h-full max-h-[582px] p-12 bg-gradient-to-b from-stone-950 to-black rounded-2xl shadow border border-fuchsia-500 border-opacity-30 flex-col justify-start items-start gap-12 inline-flex">
              {children}
            </Card.Primary>
          </div>
        </div>
      )}
    </div>
  );
};
