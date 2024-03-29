'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';

type PostUri = {
  uri: string;
  payload: {
    content: string;
  };
};

interface RepostProps {
  showModalRepost: boolean;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  postId: PostUri;
}

export default function Repost({
  showModalRepost,
  setShowModalRepost,
  postId,
}: RepostProps) {
  const [showModalLink, setShowModalLink] = useState(false);
  const modalRepostRef = useRef<HTMLDivElement>(null);
  const modalLinkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalLinkRef.current &&
        !modalLinkRef.current.contains(event.target as Node)
      ) {
        setShowModalLink(false);
      } else if (
        !showModalLink &&
        modalRepostRef.current &&
        !modalRepostRef.current.contains(event.target as Node)
      ) {
        setShowModalRepost(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalRepostRef, modalLinkRef, showModalLink, setShowModalRepost]);

  return (
    <>
      <Modal.Repost
        postId={postId}
        showModalRepost={showModalRepost}
        setShowModalRepost={setShowModalRepost}
        modalRepostRef={modalRepostRef}
        setShowModalLink={setShowModalLink}
      />
      <Modal.Link
        showModalLink={showModalLink}
        setShowModalLink={setShowModalLink}
        modalLinkRef={modalLinkRef}
      />
    </>
  );
}
