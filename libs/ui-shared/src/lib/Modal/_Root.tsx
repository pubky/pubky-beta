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
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div id="modal-root" ref={modalRef}>
            <Card.Primary
              background="bg-[#05050A] opacity-100"
              className={twMerge(
                `w-full h-full p-12 rounded-2xl shadow border border-white border-opacity-30 inline-flex flex-col`,
                rest.className,
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
