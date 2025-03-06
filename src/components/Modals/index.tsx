'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeAllModals } from '@/store/slices/modals';
import Modal from '@/components/Modal';
import { BottomSheet } from '@/components/BottomSheet';

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
  profileTags: 'ProfileTag'
};

export default function Modals() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const openModals = useAppSelector((state) => state.modals.openModals);
  const modalProps = useAppSelector((state) => state.modals.modalProps);

  useEffect(() => {
    dispatch(closeAllModals());
  }, [pathname, dispatch]);

  const renderModal = (modalType: string, modalId: string, props?: Record<string, any>) => {
    const Component = isMobile ? BottomSheet[modalType] : Modal[modalType];
    const componentProps = isMobile
      ? { show: openModals[modalId], setShow: () => dispatch(closeAllModals()) }
      : {
          showModal: openModals[modalId],
          setShowModal: () => dispatch(closeAllModals())
        };

    return Component ? <Component {...componentProps} {...props} /> : null;
  };

  return (
    <>
      {Object.keys(openModals).map(
        (modalId) =>
          openModals[modalId] && (
            <div key={modalId}>{renderModal(modalComponents[modalId], modalId, modalProps[modalId])}</div>
          )
      )}
    </>
  );
}
