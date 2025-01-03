'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, DropDown as DropDownUI, Icon, Input } from '@social/ui-shared';
import { DropDown } from '..';
import { TStatus } from '@/types';
import { Utils } from '@social/utils-shared';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { usePubkyClientContext } from '@/contexts';

interface StatusProps {
  status?: TStatus;
  subtitle?: string;
}

export default function Status({ status, subtitle }: StatusProps) {
  const { labels, emojis } = Utils.statusHelper;
  const { updateStatus } = usePubkyClientContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [customStatus, setCustomStatus] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  const [dropdownValue, setDropdownValue] = useState({
    value: 'noStatus',
    textOption: labels.loading,
    iconText: emojis.loading,
  });

  useEffect(() => {
    const emojiRegex =
      /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})(\p{Emoji_Modifier})?/gu;
    if (status && emojiRegex.test(status)) {
      const emojiMatch = status.match(emojiRegex);
      if (emojiMatch) {
        const emoji = emojiMatch[0];
        const text = status.replace(emoji, '').trim();
        setDropdownValue({
          value: 'custom',
          textOption: text,
          iconText: emoji,
        });
        setCustomStatus(text);
        setSelectedEmoji(emoji);
      }
    } else {
      setDropdownValue({
        value: status ? status : 'noStatus',
        textOption: status ? labels[status] : labels.noStatus,
        iconText: status ? emojis[status] : emojis.noStatus,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRefEmojis.current &&
        !wrapperRefEmojis.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRefEmojis]);

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
      <DropDownUI.Content
        isOpen={openDropdown}
        className="-right-20 lg:right-0 top-0"
      >
        <DropDownUI.Item
          label="Available"
          value="available"
          selected={
            dropdownValue.value !== 'custom' &&
            dropdownValue.value === 'available'
          }
          icon={'👋'}
          onClick={async () => {
            setDropdownValue({
              value: 'available',
              textOption: 'Available',
              iconText: '👋',
            });
            await updateStatus('available');
            setOpenDropdown(false);
            setCustomStatus('');
            setSelectedEmoji('');
          }}
        />
        <DropDownUI.Item
          label="Away"
          value="away"
          selected={
            dropdownValue.value !== 'custom' && dropdownValue.value === 'away'
          }
          icon={'🕓'}
          onClick={async () => {
            setDropdownValue({
              value: 'away',
              textOption: 'Away',
              iconText: '🕓',
            });
            await updateStatus('away');
            setOpenDropdown(false);
            setCustomStatus('');
            setSelectedEmoji('');
          }}
        />
        <DropDownUI.Item
          label="Vacationing"
          value="vacationing"
          selected={
            dropdownValue.value !== 'custom' &&
            dropdownValue.value === 'vacationing'
          }
          icon={'🌴'}
          onClick={async () => {
            setDropdownValue({
              value: 'vacationing',
              textOption: 'Vacationing',
              iconText: '🌴',
            });
            await updateStatus('vacationing');
            setOpenDropdown(false);
            setCustomStatus('');
            setSelectedEmoji('');
          }}
        />
        <DropDownUI.Item
          label="Working"
          value="working"
          selected={
            dropdownValue.value !== 'custom' &&
            dropdownValue.value === 'working'
          }
          icon={'👨‍💻'}
          onClick={async () => {
            setDropdownValue({
              value: 'working',
              textOption: 'Working',
              iconText: '👨‍💻',
            });
            await updateStatus('working');
            setOpenDropdown(false);
            setCustomStatus('');
            setSelectedEmoji('');
          }}
        />
        <DropDownUI.Item
          label="Traveling"
          value="traveling"
          selected={
            dropdownValue.value !== 'custom' &&
            dropdownValue.value === 'traveling'
          }
          icon={'✈️'}
          onClick={async () => {
            setDropdownValue({
              value: 'traveling',
              textOption: 'Traveling',
              iconText: '✈️',
            });
            await updateStatus('traveling');
            setOpenDropdown(false);
            setCustomStatus('');
            setSelectedEmoji('');
          }}
        />
        <DropDownUI.Item
          label="Celebrating"
          value="celebrating"
          selected={
            dropdownValue.value !== 'custom' &&
            dropdownValue.value === 'celebrating'
          }
          icon={'🥂'}
          onClick={async () => {
            setDropdownValue({
              value: 'celebrating',
              textOption: 'Celebrating',
              iconText: '🥂',
            });
            await updateStatus('celebrating');
            setOpenDropdown(false);
            setCustomStatus('');
            setSelectedEmoji('');
          }}
        />
        <DropDownUI.Item
          label="Sick"
          value="sick"
          selected={
            dropdownValue.value !== 'custom' && dropdownValue.value === 'sick'
          }
          icon={'🤒'}
          onClick={async () => {
            setDropdownValue({
              value: 'sick',
              textOption: 'Sick',
              iconText: '🤒',
            });
            await updateStatus('sick');
            setOpenDropdown(false);
            setCustomStatus('');
            setSelectedEmoji('');
          }}
        />
        <DropDownUI.Item
          label="No Status"
          value="noStatus"
          selected={
            dropdownValue.value !== 'custom' &&
            dropdownValue.value === 'noStatus'
          }
          icon={'💭'}
          onClick={async () => {
            setDropdownValue({
              value: 'noStatus',
              textOption: 'No Status',
              iconText: '💭',
            });
            await updateStatus('noStatus');
            setOpenDropdown(false);
            setCustomStatus('');
            setSelectedEmoji('');
          }}
        />
        <div>
          {showEmojis && (
            <div
              className="absolute translate-y-[20%] -translate-x-[15%] lg:translate-x-[30%] z-10"
              ref={wrapperRefEmojis}
            >
              <EmojiPicker
                theme={Theme.DARK}
                emojiStyle={EmojiStyle.TWITTER}
                onEmojiClick={(emojiObject) => {
                  setSelectedEmoji(emojiObject.emoji);
                  setShowEmojis(false);
                }}
              />
            </div>
          )}
          <div>
            <Input.Label
              className="flex mt-4 text-left text-[11px]"
              value="Custom Status"
            />
            <Input.Text
              className="h-[30px]"
              value={customStatus}
              placeholder="Add status"
              maxLength={12}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCustomStatus(e.target.value)
              }
              action={
                <div className="flex gap-2">
                  {customStatus && selectedEmoji && (
                    <Button.Action
                      icon={<Icon.Plus size="18" />}
                      onClick={() => {
                        setDropdownValue({
                          value: 'custom',
                          textOption: customStatus,
                          iconText: selectedEmoji,
                        });
                        updateStatus(`${selectedEmoji}${customStatus}`);
                        setOpenDropdown(false);
                      }}
                      variant="custom"
                      size="small"
                    />
                  )}
                  {selectedEmoji ? (
                    <div
                      className="cursor-pointer flex items-center"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowEmojis(true);
                      }}
                    >
                      {selectedEmoji}
                    </div>
                  ) : (
                    <Button.Action
                      variant="custom"
                      icon={<Icon.Smiley size="32" />}
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowEmojis(true);
                      }}
                    />
                  )}
                </div>
              }
            />
          </div>
        </div>
      </DropDownUI.Content>
    </DropDown>
  );
}
