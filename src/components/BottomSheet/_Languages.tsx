'use client';

import { BottomSheet, Icon, Typography } from '@social/ui-shared';
import { useState } from 'react';
import ContentLanguages from '../DropDown/_Languages/_Content';

interface ReachProps {
  title?: string;
  className?: string;
}

const labels = {
  english: 'English',
  spanish: 'Spanish',
  german: 'German',
  french: 'French',
  italian: 'Italian'
};

const flags = {
  english: <Icon.UnitedStates size="24" />,
  spanish: <Icon.Spain size="24" />,
  german: <Icon.Germany size="24" />,
  french: <Icon.France size="24" />,
  italian: <Icon.Italy size="24" />
};

export default function Languages({ title, className }: ReachProps) {
  const [show, setShow] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'english',
    textOption: labels.english,
    iconOption: flags.english
  });

  return (
    <>
      <Typography.Body
        className="flex items-center cursor-pointer text-xl font-light font-InterTight leading-7 tracking-wide"
        variant="medium"
        onClick={() => setShow(true)}
      >
        <span className="mr-1">{dropdownValue.iconOption}</span> {dropdownValue.textOption}
        <div className={`ml-1 transition ease duration-300 ${show ? 'rotate-180' : 'rotate-0'}`}>
          <Icon.DropdownIcon />
        </div>
      </Typography.Body>
      <BottomSheet.Root show={show} setShow={setShow} title={title} className={className}>
        <ContentLanguages setOpenDropdown={setShow} dropdownValue={dropdownValue} setDropdownValue={setDropdownValue} />
      </BottomSheet.Root>
    </>
  );
}
