'use client';

import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

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
        handleClickOutsideModalCheckLink
      );
    };
  }, [modalCheckLinkRef, setShowModalCheckLink]);
  return (
    <Modal.Root
      show={showModalCheckLink}
      closeModal={() => setShowModalCheckLink(false)}
      modalRef={modalCheckLinkRef}
      className="w-[580px]"
    >
      <Modal.CloseAction onClick={() => setShowModalCheckLink(false)} />
      <Modal.Header title="Double-check this link" />
      <Typography.Body className="text-opacity-60" variant="medium">
        The link is taking you to another site:{' '}
        <span className="text-white text-opacity-100 font-bold">
          {clickedLink}
        </span>
        . Are you sure you want to continue?
      </Typography.Body>
      <div className="flex gap-4 mt-8">
        <Button.Large
          variant="secondary"
          onClick={() => setShowModalCheckLink(false)}
        >
          Cancel
        </Button.Large>
        <Link className="w-full" href={clickedLink} target="_blank">
          <Modal.SubmitAction
            onClick={() => setShowModalCheckLink(false)}
            icon={<Icon.ArrowRight size="16" />}
          >
            Continue
          </Modal.SubmitAction>
        </Link>
      </div>
    </Modal.Root>
  );
}
