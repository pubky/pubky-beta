'use client';

import { useEffect, useState } from 'react';
import { DropDown as DropDownUI } from '@social/ui-shared';

import { TStatus } from '@/types';
import { Utils } from '@social/utils-shared';
import DropDown from '../_DropDown';
import ContentStatus from './Content';

interface StatusProps {
  status?: TStatus;
  subtitle?: string;
}

export default function Status({ status, subtitle }: StatusProps) {
  const { labels, emojis } = Utils.statusHelper;
  const [openDropdown, setOpenDropdown] = useState(false);
  const [customStatus, setCustomStatus] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [dropdownValue, setDropdownValue] = useState({
    value: 'noStatus',
    textOption: labels.loading,
    iconText: emojis.loading
  });

  useEffect(() => {
    const emojiRegex = /\p{RI}\p{RI}|\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*/gu;

    if (status && emojiRegex.test(status)) {
      const emojiMatch = status.match(emojiRegex);
      if (emojiMatch) {
        const emoji = emojiMatch[0];
        const text = status.replace(emoji, '').trim();
        setDropdownValue({
          value: 'custom',
          textOption: text,
          iconText: emoji
        });
        setCustomStatus(text);
        setSelectedEmoji(emoji);
      }
    } else {
      setDropdownValue({
        value: status ? status : 'noStatus',
        textOption: status ? labels[status] : labels.noStatus,
        iconText: status ? emojis[status] : emojis.noStatus
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Sort"
      type={'text'}
      subtitle={subtitle}
      className={openDropdown ? 'z-20' : ''}
    >
      <DropDownUI.Content isOpen={openDropdown} className="-right-20 lg:right-0 top-0">
        <ContentStatus
          setOpenDropdown={setOpenDropdown}
          dropdownValue={dropdownValue}
          setDropdownValue={setDropdownValue}
          setCustomStatus={setCustomStatus}
          setSelectedEmoji={setSelectedEmoji}
          customStatus={customStatus}
          selectedEmoji={selectedEmoji}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
