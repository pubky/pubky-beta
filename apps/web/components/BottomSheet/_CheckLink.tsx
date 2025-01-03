'use client';

import {
  BottomSheet,
  Button,
  Icon,
  Input,
  Typography,
} from '@social/ui-shared';
import { useState } from 'react';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';

interface CheckLinkProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  clickedLink: string;
  title?: string;
  className?: string;
}

export default function CheckLink({
  show,
  setShow,
  clickedLink,
  title,
  className,
}: CheckLinkProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (newCheckedState: boolean) => {
    setIsChecked(newCheckedState);
    Utils.storage.set('checkLink', !newCheckedState);
  };
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Double-check this link'}
      className={className}
    >
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
        <Button.Large variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button.Large>
        <Link className="w-full" href={clickedLink} target="_blank">
          <Button.Large
            onClick={() => setShow(false)}
            icon={<Icon.ArrowRight size="16" />}
          >
            Continue
          </Button.Large>
        </Link>
      </div>
      <Input.Checkbox
        checked={isChecked}
        onCheckChange={handleCheckboxChange}
        text="Don't show this again"
      />
    </BottomSheet.Root>
  );
}
