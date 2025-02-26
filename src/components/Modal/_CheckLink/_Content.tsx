'use client';

import { useState } from 'react';
import { Button, Icon, Input, Modal, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { Utils } from '@social/utils-shared';

interface CheckLinkProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  clickedLink: string;
}

export default function ContentCheckLink({ setShow, clickedLink }: CheckLinkProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (newCheckedState: boolean) => {
    setIsChecked(newCheckedState);
  };

  const handleContinueClick = () => {
    Utils.storage.set('checkLink', !isChecked);
    setShow(false);
  };

  return (
    <>
      <Typography.Body className="text-opacity-60 mt-4" variant="medium">
        The link is taking you to another site:
        <div className="my-4">
          <span className="text-white text-opacity-100 font-bold">{Utils.minifyText(clickedLink, 50)}</span>
        </div>
        Are you sure you want to continue?
      </Typography.Body>
      <div className="flex gap-4 my-6">
        <Button.Large variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button.Large>
        <Link className="w-full" href={clickedLink} target="_blank">
          <Modal.SubmitAction onClick={handleContinueClick} icon={<Icon.ArrowRight size="16" />}>
            Continue
          </Modal.SubmitAction>
        </Link>
      </div>
      <Input.Checkbox checked={isChecked} onCheckChange={handleCheckboxChange} text="Don't show this again" />
    </>
  );
}
