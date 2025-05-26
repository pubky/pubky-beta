'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import Modal from '@/components/Modal';
import { BottomSheet } from '@/components';

interface ModalContextType {
  openModal: (modalId: string, props?: Record<string, any>) => void;
  closeModal: (modalId: string) => void;
  isOpen: (modalId: string) => boolean;
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  isOpen: () => false
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({});
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [modalOrder, setModalOrder] = useState<string[]>([]);

  const openModal = (modalId: string, props: Record<string, any> = {}) => {
    setOpenModals((prev) => ({ ...prev, [modalId]: true }));
    setModalProps((prev) => ({ ...prev, [modalId]: props }));
    setModalOrder((prev) => [...prev, modalId]);
  };

  const closeModal = (modalId: string) => {
    setOpenModals((prev) => ({ ...prev, [modalId]: false }));
    setModalProps((prev) => {
      const newProps = { ...prev };
      delete newProps[modalId];
      return newProps;
    });
    setModalOrder((prev) => prev.filter((id) => id !== modalId));
  };

  const isOpen = (modalId: string) => !!openModals[modalId];

  useEffect(() => {
    setOpenModals({});
    setModalProps({});
    setModalOrder([]);
  }, [pathname]);

  const modalComponents: Record<string, string> = {
    backup: 'Backup',
    checkContent: 'CheckContent',
    checkLink: 'CheckLink',
    connectionLost: 'ConnectionLost',
    createArticle: 'CreateArticle',
    createFeed: 'CreateFeed',
    createPost: 'CreatePost',
    createReply: 'CreateReply',
    createRepost: 'CreateRepost',
    croppedImage: 'CroppedImage',
    deleteAccount: 'DeleteAccount',
    deletePost: 'DeletePost',
    editArticle: 'EditArticle',
    editFeed: 'EditFeed',
    editPost: 'EditPost',
    feedback: 'Feedback',
    filesCarousel: 'FilesCarousel',
    join: 'Join',
    link: 'Link',
    logout: 'Logout',
    reportPost: 'ReportPost',
    reportProfile: 'ReportProfile',
    sessionExpired: 'SessionExpired',
    tagCreatePost: 'TagCreatePost',
    menuPost: 'Menu',
    menuProfile: 'MenuProfile'
  };

  const renderModal = (modalType: string, modalId: string, props?: Record<string, any>) => {
    const shouldUseModal = !isMobile || modalId === 'filesCarousel';
    const Component = shouldUseModal ? Modal[modalType] : BottomSheet[modalType];

    const componentProps = shouldUseModal
      ? { showModal: openModals[modalId], setShowModal: () => closeModal(modalId), ...props }
      : { show: openModals[modalId], setShow: () => closeModal(modalId), ...props };
    return Component ? <Component {...componentProps} {...props} /> : null;
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      {modalOrder.map(
        (modalId, index) =>
          openModals[modalId] && (
            <div key={modalId} style={{ zIndex: 50 + index }}>
              {renderModal(modalComponents[modalId], modalId, modalProps[modalId])}
            </div>
          )
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
