'use client';

import { useEffect, useRef } from 'react';
import { Modal } from '@social/ui-shared';
import ContentCheckLink from './_Content';

interface CheckLinkProps {
  showModalCheckLink: boolean;
  setShowModalCheckLink: React.Dispatch<React.SetStateAction<boolean>>;
  clickedLink: string;
}

export default function CheckLink({
  showModalCheckLink,
  setShowModalCheckLink,
  clickedLink,
}: CheckLinkProps) {
  const modalCheckLinkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalCheckLink = (event: MouseEvent) => {
      if (
        modalCheckLinkRef.current &&
        !modalCheckLinkRef.current.contains(event.target as Node)
      ) {
        setShowModalCheckLink(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalCheckLink);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideModalCheckLink,
      );
    };
  }, [modalCheckLinkRef, setShowModalCheckLink]);

  return (
    <Modal.Root
      show={showModalCheckLink}
      closeModal={() => setShowModalCheckLink(false)}
      modalRef={modalCheckLinkRef}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModalCheckLink(false)} />
      <Modal.Header title="Double-check this link" />
      <ContentCheckLink
        setShow={setShowModalCheckLink}
        clickedLink={clickedLink}
      />
    </Modal.Root>
  );
}
