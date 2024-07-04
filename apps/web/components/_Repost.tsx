'use client';

import { useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { IPost } from '@/types';

interface RepostProps {
  showModalRepost: boolean;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
  handleRepost: () => Promise<void>;
}

export default function Repost({
  showModalRepost,
  setShowModalRepost,
  post,
  handleRepost,
}: RepostProps) {
  const modalRepostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRepostRef.current &&
        !modalRepostRef.current.contains(event.target as Node)
      ) {
        setShowModalRepost(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalRepostRef, setShowModalRepost]);

  return (
    <Modal.Repost
      post={post}
      showModalRepost={showModalRepost}
      setShowModalRepost={setShowModalRepost}
      modalRepostRef={modalRepostRef}
      handleRepost={handleRepost}
    />
  );
}
