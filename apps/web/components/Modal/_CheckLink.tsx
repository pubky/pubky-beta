'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Icon, Input, Modal, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { Utils } from '@social/utils-shared';

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
  const [isChecked, setIsChecked] = useState(false);

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

  const handleCheckboxChange = (newCheckedState: boolean) => {
    setIsChecked(newCheckedState);
    Utils.storage.set('checkLink', !newCheckedState);
  };

  return (
    <Modal.Root
      show={showModalCheckLink}
      closeModal={() => setShowModalCheckLink(false)}
      modalRef={modalCheckLinkRef}
      className="w-[588px]"
    >
      <Modal.CloseAction onClick={() => setShowModalCheckLink(false)} />
      <Modal.Header title="Double-check this link" />
      <Typography.Body className="text-opacity-60" variant="medium">
        The link is taking you to another site:
        <div className="mt-4 mb-4">
          <span className="text-white text-opacity-100 font-bold">
            {Utils.minifyText(clickedLink, 50)}
          </span>
        </div>
        Are you sure you want to continue?
      </Typography.Body>
      <div className="flex gap-4 my-6">
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
      <Input.Checkbox
        checked={isChecked}
        onCheckChange={handleCheckboxChange}
        text="Don't show this again"
      />
    </Modal.Root>
  );
}
