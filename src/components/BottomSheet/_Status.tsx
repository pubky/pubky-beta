'use client';

import { BottomSheet, Icon, Typography } from '@social/ui-shared';
import ContentStatus from '../DropDown/_Status/Content';
import { useEffect, useState } from 'react';
import { Utils } from '@social/utils-shared';

interface StatusProps {
  status: string;
  title?: string;
  className?: string;
}

export default function Status({ status, title, className }: StatusProps) {
  const { labels, emojis } = Utils.statusHelper;
  const [show, setShow] = useState(false);
  const [customStatus, setCustomStatus] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [statusValue, setStatusValue] = useState({
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
        setStatusValue({
          value: 'custom',
          textOption: text,
          iconText: emoji
        });
        setCustomStatus(text);
        setSelectedEmoji(emoji);
      }
    } else {
      setStatusValue({
        value: status ? status : 'noStatus',
        textOption: status ? labels[status] : labels.noStatus,
        iconText: status ? emojis[status] : emojis.noStatus
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      <Typography.Body
        className="flex items-center cursor-pointer text-xl font-light font-InterTight leading-7 tracking-wide"
        variant="medium"
        onClick={() => setShow(true)}
      >
        {statusValue.iconText} {statusValue.textOption}
        <div className={`ml-1 transition ease duration-300 ${show ? 'rotate-180' : 'rotate-0'}`}>
          <Icon.DropdownIcon />
        </div>
      </Typography.Body>

      <BottomSheet.Root show={show} setShow={setShow} title={title} className={className}>
        <ContentStatus
          setOpenDropdown={setShow}
          dropdownValue={statusValue}
          setDropdownValue={setStatusValue}
          setCustomStatus={setCustomStatus}
          setSelectedEmoji={setSelectedEmoji}
          customStatus={customStatus}
          selectedEmoji={selectedEmoji}
        />
      </BottomSheet.Root>
    </>
  );
}
