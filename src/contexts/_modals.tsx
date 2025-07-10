'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import Modal from '@/components/Modal';
import { BottomSheet } from '@/components';
import { getPost } from '@/services/postService';
import { usePubkyClientContext } from '@/contexts';

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
  const { pubky } = usePubkyClientContext();
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({});
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [modalOrder, setModalOrder] = useState<string[]>([]);
  const previousPathname = useRef<string>('');
  const isNavigatingFromModal = useRef<boolean>(false);
  const modalOpenedByUrl = useRef<boolean>(false);

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

  // Check if current pathname is a post URL and open modal automatically
  {
    /** */
  }
  useEffect(() => {
    const checkAndOpenPostModal = async () => {
      // Check if pathname matches post URL pattern: /post/[pubky]/[postId]
      const postUrlMatch = pathname.match(/^\/post\/([^\/]+)\/([^\/]+)$/);

      // If we're navigating from a modal to a different page, close the modal instead
      if (isNavigatingFromModal.current) {
        isNavigatingFromModal.current = false;
        if (openModals['postView']) {
          closeModal('postView');
        }
        return;
      }

      // Only open modal if it's not already open and we're not navigating from a modal
      if (postUrlMatch && !openModals['postView'] && !modalOpenedByUrl.current) {
        const [, pubkyParam, postIdParam] = postUrlMatch;

        try {
          // Fetch the post data
          const post = await getPost(pubkyParam, postIdParam, pubky ?? '');

          if (post) {
            // Mark that we opened the modal via URL
            modalOpenedByUrl.current = true;
            // Open the PostView modal with the fetched post
            openModal('postView', { post });
          }
        } catch (error) {
          console.error('Error fetching post for modal:', error);
        }
      }
    };

    checkAndOpenPostModal();
  }, [pathname, pubky, openModals]);

  // Track pathname changes to detect navigation from modal
  useEffect(() => {
    // If we had a modal open and the pathname changed to something other than a post URL,
    // mark that we're navigating from a modal
    if (openModals['postView'] && previousPathname.current && pathname !== previousPathname.current) {
      const postUrlMatch = pathname.match(/^\/post\/([^\/]+)\/([^\/]+)$/);
      if (!postUrlMatch) {
        isNavigatingFromModal.current = true;
        modalOpenedByUrl.current = false; // Reset the flag
      }
    }

    previousPathname.current = pathname;
  }, [pathname, openModals]);

  // Reset modal opened by URL flag when modal closes
  useEffect(() => {
    if (!openModals['postView']) {
      modalOpenedByUrl.current = false;
    }
  }, [openModals['postView']]);

  useEffect(() => {
    setOpenModals({});
    setModalProps({});
    setModalOrder([]);
    modalOpenedByUrl.current = false;
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
    minimumAge: 'MinimumAge',
    postView: 'PostView',
    privacyPolicy: 'PrivacyPolicy',
    reportPost: 'ReportPost',
    reportProfile: 'ReportProfile',
    repostedUsers: 'RepostedUsers',
    sessionExpired: 'SessionExpired',
    tagCreatePost: 'TagCreatePost',
    termsOfService: 'TermsOfService',
    menuPost: 'Menu',
    menuProfile: 'MenuProfile'
  };

  const renderModal = (modalType: string, modalId: string, props?: Record<string, any>) => {
    // Always use modal for postView, use modal for filesCarousel, otherwise use bottom sheet on mobile
    const shouldUseModal = !isMobile || modalId === 'filesCarousel' || modalId === 'postView';
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
            <div key={`${modalId}-${index}`} style={{ zIndex: 50 + index }}>
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
