'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import Modal from '@/components/Modal';
import { BottomSheet } from '@/components';
import { getPost } from '@/services/postService';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

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
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);

  const openModal = async (modalId: string, props: Record<string, any> = {}) => {
    // If the modal is already open, just update its props
    if (openModals[modalId]) {
      setModalProps((prev) => ({ ...prev, [modalId]: props }));
    } else {
      // Otherwise, open a new modal
      setOpenModals((prev) => ({ ...prev, [modalId]: true }));
      setModalProps((prev) => ({ ...prev, [modalId]: props }));
      setModalOrder((prev) => {
        // Keep postView at the beginning if it exists
        const hasPostView = prev.includes('postView');
        const filteredOrder = prev.filter((id) => id !== 'postView' && id !== modalId);

        if (modalId === 'postView') {
          // Always put postView at the beginning
          return ['postView', ...filteredOrder];
        }

        // For other modals, add to the end if not already present
        const newOrder = filteredOrder.includes(modalId) ? filteredOrder : [...filteredOrder, modalId];

        // If postView was in the original order, keep it at the beginning
        return hasPostView ? ['postView', ...newOrder] : newOrder;
      });
    }
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

      // Only open modal if it's not already open, we're not navigating from a modal,
      // and the modal wasn't opened by direct click (check if modalProps has post data)
      if (postUrlMatch && !openModals['postView'] && !modalOpenedByUrl.current && !modalProps['postView']) {
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
  }, [pathname, pubky, openModals, modalProps]);

  // Update post view modal when URL changes
  useEffect(() => {
    if (openModals['postView'] && pathname !== previousPathname.current) {
      const postUrlMatch = pathname.match(/^\/post\/([^\/]+)\/([^\/]+)$/);
      if (postUrlMatch) {
        const [, pubkyParam, postIdParam] = postUrlMatch;
        const fetchAndUpdatePost = async () => {
          try {
            const newPost = await getPost(pubkyParam, postIdParam, pubky ?? '');
            if (newPost) {
              setModalProps((prev) => ({ ...prev, postView: { post: newPost } }));
            }
          } catch (error) {
            console.error('Error fetching post for modal update:', error);
          }
        };
        fetchAndUpdatePost();
      }
    }
    previousPathname.current = pathname;
  }, [pathname, openModals, pubky]);

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
      // Also clear the modal props to ensure clean state for next opening
      setModalProps((prev) => {
        const newProps = { ...prev };
        delete newProps['postView'];
        return newProps;
      });
    }
  }, [openModals['postView']]);

  // Debounced reset of modals to handle rapid navigation
  useEffect(() => {
    const postUrlMatch = pathname.match(/^\/post\/([^\/]+)\/([^\/]+)$/);

    // Clear any existing timeout
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current);
    }

    if (!postUrlMatch) {
      // Add a small delay to handle rapid navigation
      navigationTimeout.current = setTimeout(() => {
        // Don't close modals that should persist across navigation
        const persistentModals = ['connectionLost', 'sessionExpired'];
        setOpenModals((prev) => {
          const newModals = { ...prev };
          // Only close non-persistent modals
          Object.keys(newModals).forEach((modalId) => {
            if (!persistentModals.includes(modalId)) {
              delete newModals[modalId];
            }
          });
          return newModals;
        });

        setModalProps((prev) => {
          const newProps = { ...prev };
          // Only clear props for non-persistent modals
          Object.keys(newProps).forEach((modalId) => {
            if (!persistentModals.includes(modalId)) {
              delete newProps[modalId];
            }
          });
          return newProps;
        });

        setModalOrder((prev) => prev.filter((modalId) => persistentModals.includes(modalId)));
        modalOpenedByUrl.current = false;
      }, 50);
    } else {
      // If we're on a post URL, clear the timeout and don't reset
      navigationTimeout.current = null;
    }

    return () => {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
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
