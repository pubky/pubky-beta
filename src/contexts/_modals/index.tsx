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

  const openModal = (modalId: string, props: Record<string, any> = {}) => {
    setOpenModals((prev) => ({ ...prev, [modalId]: true }));
    setModalProps((prev) => ({ ...prev, [modalId]: props }));
  };

  const closeModal = (modalId: string) => {
    setOpenModals((prev) => ({ ...prev, [modalId]: false }));
    setModalProps((prev) => {
      const newProps = { ...prev };
      delete newProps[modalId];
      return newProps;
    });
  };

  const isOpen = (modalId: string) => !!openModals[modalId];

  useEffect(() => {
    setOpenModals({});
    setModalProps({});
  }, [pathname]);

  const modalComponents: Record<string, string> = {
    backup: 'Backup',
    checkLink: 'CheckLink',
    createArticle: 'CreateArticle',
    createFeed: 'CreateFeed',
    createPost: 'CreatePost',
    createReply: 'CreateReply',
    createRepost: 'CreateRepost',
    croppedImage: 'CroppedImage',
    deleteAccount: 'DeleteAccount',
    deletePost: 'DeletePost',
    editArticle: 'EditArticle',
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
    menuProfile: 'MenuProfile',
    tags: 'Tag',
    tagPost: 'TagPost',
    tagSinglePost: 'TagSinglePost',
    profileTags: 'ProfileTag'
  };

  const renderModal = (modalType: string, modalId: string, props?: Record<string, any>) => {
    const Component = isMobile ? BottomSheet[modalType] : Modal[modalType];
    const componentProps = isMobile
      ? { show: openModals[modalId], setShow: () => closeModal(modalId) }
      : {
          showModal: openModals[modalId],
          setShowModal: () => closeModal(modalId)
        };

    return Component ? <Component {...componentProps} {...props} /> : null;
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      {Object.keys(openModals).map(
        (modalId) =>
          openModals[modalId] && (
            <div key={modalId}>{renderModal(modalComponents[modalId], modalId, modalProps[modalId])}</div>
          )
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
