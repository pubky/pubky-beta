'use client';

import { createContext, useContext, useState } from 'react';
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
  isOpen: () => false,
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
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

  const modalComponents: Record<string, (props: any) => JSX.Element> = {
    backup: (props) =>
      isMobile ? (
        <BottomSheet.Backup
          show={openModals['backup']}
          setShow={() => closeModal('backup')}
          {...props}
        />
      ) : (
        <Modal.Backup
          showModal={openModals['backup']}
          setShowModal={() => closeModal('backup')}
          {...props}
        />
      ),
    checkLink: (props) =>
      isMobile ? (
        <BottomSheet.CheckLink
          show={openModals['checkLink']}
          setShow={() => closeModal('checkLink')}
          {...props}
        />
      ) : (
        <Modal.CheckLink
          showModal={openModals['checkLink']}
          setShowModal={() => closeModal('checkLink')}
          {...props}
        />
      ),
    createArticle: (props) =>
      isMobile ? (
        <BottomSheet.CreateArticle
          show={openModals['createArticle']}
          setShow={() => closeModal('createArticle')}
          {...props}
        />
      ) : (
        <Modal.CreateArticle
          showModal={openModals['createArticle']}
          setShowModal={() => closeModal('createArticle')}
          {...props}
        />
      ),
    createFeed: (props) =>
      isMobile ? (
        <BottomSheet.CreateFeed
          show={openModals['createFeed']}
          setShow={() => closeModal('createFeed')}
          {...props}
        />
      ) : (
        <Modal.CreateFeed
          showModal={openModals['createFeed']}
          setShowModal={() => closeModal('createFeed')}
          {...props}
        />
      ),
    createPost: () =>
      isMobile ? (
        <BottomSheet.CreatePost
          show={openModals['createPost']}
          setShow={() => closeModal('createPost')}
        />
      ) : (
        <Modal.CreatePost
          showModal={openModals['createPost']}
          setShowModal={() => closeModal('createPost')}
        />
      ),
    createReply: (props) =>
      isMobile ? (
        <BottomSheet.CreateReply
          show={openModals['createReply']}
          setShow={() => closeModal('createReply')}
          {...props}
        />
      ) : (
        <Modal.CreateReply
          showModal={openModals['createReply']}
          setShowModal={() => closeModal('createReply')}
          {...props}
        />
      ),
    createRepost: (props) =>
      isMobile ? (
        <BottomSheet.CreateRepost
          show={openModals['createRepost']}
          setShow={() => closeModal('createRepost')}
          {...props}
        />
      ) : (
        <Modal.CreateRepost
          showModal={openModals['createRepost']}
          setShowModal={() => closeModal('createRepost')}
          {...props}
        />
      ),
    croppedImage: (props) =>
      isMobile ? (
        <BottomSheet.CroppedImage
          show={openModals['croppedImage']}
          setShow={() => closeModal('croppedImage')}
          {...props}
        />
      ) : (
        <Modal.CroppedImage
          showModal={openModals['croppedImage']}
          setShowModal={() => closeModal('croppedImage')}
          {...props}
        />
      ),
    deleteAccount: () =>
      isMobile ? (
        <BottomSheet.DeleteAccount
          show={openModals['deleteAccount']}
          setShow={() => closeModal('deleteAccount')}
        />
      ) : (
        <Modal.DeleteAccount
          showModal={openModals['deleteAccount']}
          setShowModal={() => closeModal('deleteAccount')}
        />
      ),
    deletePost: (props) =>
      isMobile ? (
        <BottomSheet.DeletePost
          show={openModals['deletePost']}
          setShow={() => closeModal('deletePost')}
          {...props}
        />
      ) : (
        <Modal.DeletePost
          showModal={openModals['deletePost']}
          setShowModal={() => closeModal('deletePost')}
          {...props}
        />
      ),
    editArticle: (props) =>
      isMobile ? (
        <BottomSheet.EditArticle
          show={openModals['editArticle']}
          setShow={() => closeModal('editArticle')}
          {...props}
        />
      ) : (
        <Modal.EditArticle
          showModal={openModals['editArticle']}
          setShowModal={() => closeModal('editArticle')}
          {...props}
        />
      ),
    editPost: (props) =>
      isMobile ? (
        <BottomSheet.EditPost
          show={openModals['editPost']}
          setShow={() => closeModal('editPost')}
          {...props}
        />
      ) : (
        <Modal.EditPost
          showModal={openModals['editPost']}
          setShowModal={() => closeModal('editPost')}
          {...props}
        />
      ),
    feedback: () =>
      isMobile ? (
        <BottomSheet.Feedback
          show={openModals['feedback']}
          setShow={() => closeModal('feedback')}
        />
      ) : (
        <Modal.Feedback
          showModal={openModals['feedback']}
          setShowModal={() => closeModal('feedback')}
        />
      ),
    filesCarousel: (props) =>
      isMobile ? (
        <BottomSheet.FilesCarousel
          show={openModals['filesCarousel']}
          setShow={() => closeModal('filesCarousel')}
          {...props}
        />
      ) : (
        <Modal.FilesCarousel
          showModal={openModals['filesCarousel']}
          setShowModal={() => closeModal('filesCarousel')}
          {...props}
        />
      ),
    join: () =>
      isMobile ? (
        <BottomSheet.Join
          show={openModals['join']}
          setShow={() => closeModal('join')}
        />
      ) : (
        <Modal.Join
          showModal={openModals['join']}
          setShowModal={() => closeModal('join')}
        />
      ),
    link: (props) =>
      isMobile ? (
        <BottomSheet.Link
          show={openModals['link']}
          setShow={() => closeModal('link')}
          {...props}
        />
      ) : (
        <Modal.Link
          showModal={openModals['link']}
          setShowModal={() => closeModal('link')}
          {...props}
        />
      ),
    logout: () =>
      isMobile ? (
        <BottomSheet.Logout
          show={openModals['logout']}
          setShow={() => closeModal('logout')}
        />
      ) : (
        <Modal.Logout
          showModal={openModals['logout']}
          setShowModal={() => closeModal('logout')}
        />
      ),
    reportPost: (props) =>
      isMobile ? (
        <BottomSheet.ReportPost
          show={openModals['reportPost']}
          setShow={() => closeModal('reportPost')}
          {...props}
        />
      ) : (
        <Modal.ReportPost
          showModal={openModals['reportPost']}
          setShowModal={() => closeModal('reportPost')}
          {...props}
        />
      ),
    reportProfile: (props) =>
      isMobile ? (
        <BottomSheet.ReportProfile
          show={openModals['reportProfile']}
          setShow={() => closeModal('reportProfile')}
          {...props}
        />
      ) : (
        <Modal.ReportProfile
          showModal={openModals['reportProfile']}
          setShowModal={() => closeModal('reportProfile')}
          {...props}
        />
      ),
    sessionExpired: () =>
      isMobile ? (
        <BottomSheet.SessionExpired
          show={openModals['sessionExpired']}
          setShow={() => closeModal('sessionExpired')}
        />
      ) : (
        <Modal.SessionExpired
          showModal={openModals['sessionExpired']}
          setShowModal={() => closeModal('sessionExpired')}
        />
      ),
    tagCreatePost: (props) =>
      isMobile ? (
        <BottomSheet.TagCreatePost
          show={openModals['tagCreatePost']}
          setShow={() => closeModal('tagCreatePost')}
          {...props}
        />
      ) : (
        <Modal.TagCreatePost
          showModal={openModals['tagCreatePost']}
          setShowModal={() => closeModal('tagCreatePost')}
          {...props}
        />
      ),
    menuPost: (props) =>
      isMobile ? (
        <BottomSheet.Menu
          show={openModals['menuPost']}
          setShow={() => closeModal('menuPost')}
          {...props}
        />
      ) : (
        <></>
      ),
    menuProfile: (props) =>
      isMobile ? (
        <BottomSheet.MenuProfile
          show={openModals['menuProfile']}
          setShow={() => closeModal('menuProfile')}
          {...props}
        />
      ) : (
        <></>
      ),
    tags: (props) =>
      isMobile ? (
        <BottomSheet.Tag
          show={openModals['tags']}
          setShow={() => closeModal('tags')}
          {...props}
        />
      ) : (
        <Modal.Tag
          showModal={openModals['tags']}
          setShowModal={() => closeModal('tags')}
          {...props}
        />
      ),
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      {Object.keys(openModals).map(
        (modalId) =>
          openModals[modalId] && (
            <div key={modalId}>
              {modalComponents[modalId]?.(modalProps[modalId] || {})}
            </div>
          ),
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
