'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Button, Card, Icon, Modal, Typography } from '@social/ui-shared';
import Link from 'next/link';

interface ModalContextType {
  openJoinModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openJoinModal: () => {},
});

export function ModalJoinProvider({ children }: { children: React.ReactNode }) {
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const modalJoinRef = useRef<HTMLDivElement>(null);

  const openJoinModal = () => {
    setJoinModalOpen(true);
  };

  const closeJoinModal = () => {
    setJoinModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalJoinRef.current &&
        !modalJoinRef.current.contains(event.target as Node)
      ) {
        setJoinModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalJoinRef, setJoinModalOpen]);

  return (
    <ModalContext.Provider value={{ openJoinModal }}>
      {children}
      <Modal.Root
        show={isJoinModalOpen}
        closeModal={closeJoinModal}
        modalRef={modalJoinRef}
        className="md:max-w-[792px] max-h-[600px] md:max-h-full overflow-y-auto"
      >
        <Modal.CloseAction id="join-modal-close-btn" onClick={closeJoinModal} />
        <Modal.Header title="Join Pubky" />
        <>
          <Typography.Body
            className="text-opacity-80 my-4"
            variant="medium-light"
          >
            Enjoying Pubky? Creating an account is easy as one, two, three.
          </Typography.Body>
          <div className="flex flex-col sm:flex-row gap-6">
            <Card.Primary
              title="New here?"
              text="Join by scanning a QR with Bitkit, or by creating a new pubky."
            >
              <div className="flex justify-center items-center my-10">
                <Icon.UserPlus size="128" />
              </div>
              <Link href="/onboarding/sign-in">
                <Button.Large
                  id="backup-recovery-phrase-btn"
                  onClick={closeJoinModal}
                  icon={<Icon.UserPlus size="16" />}
                >
                  Join Pubky
                </Button.Large>
              </Link>
            </Card.Primary>
            <Card.Primary
              title="Sign in"
              text="Already have an account? Sign in to interact with Pubky."
            >
              <div className="flex justify-center items-center my-10">
                <Icon.Key size="128" />
              </div>
              <Link href="/sign-in">
                <Button.Large
                  id="backup-recovery-file-btn"
                  onClick={closeJoinModal}
                  icon={<Icon.Key size="16" />}
                >
                  Sign in
                </Button.Large>
              </Link>
            </Card.Primary>
          </div>
        </>
      </Modal.Root>
    </ModalContext.Provider>
  );
}

export function useJoinModal() {
  return useContext(ModalContext);
}
