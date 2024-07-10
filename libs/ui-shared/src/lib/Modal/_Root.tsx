import { Card } from '../Card';
import { twMerge } from 'tailwind-merge';

interface RootModalProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  closeModal?: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
}

export const Root = ({
  show = false,
  closeModal,
  modalRef,
  children,
  ...rest
}: RootModalProps) => {
  return (
    <div className="flex justify-center items-center">
      {show && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
          <div ref={modalRef}>
            <Card.Primary
              background="bg-gradient-to-br from-black to-[#07040a] opacity-100"
              className={twMerge(
                `w-full h-full p-12 rounded-2xl shadow border border-white border-opacity-30 flex-col inline-flex`,
                rest.className
              )}
            >
              {children}
            </Card.Primary>
          </div>
        </div>
      )}
    </div>
  );
};
