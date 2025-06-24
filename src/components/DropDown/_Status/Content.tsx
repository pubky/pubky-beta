'use client';

import { useRef, useState } from 'react';
import { Button, DropDown as DropDownUI, Icon, Input } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import EmojiPicker from '@/components/EmojiPicker';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';

interface StatusProps {
  setOpenDropdown: any;
  dropdownValue: any;
  setDropdownValue: any;
  setCustomStatus: any;
  setSelectedEmoji: any;
  customStatus: any;
  selectedEmoji: any;
}

export default function ContentStatus({
  setOpenDropdown,
  dropdownValue,
  setDropdownValue,
  setCustomStatus,
  setSelectedEmoji,
  customStatus,
  selectedEmoji
}: StatusProps) {
  const { updateStatus } = usePubkyClientContext();
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));

  return (
    <>
      <DropDownUI.Item
        label="Available"
        value="available"
        selected={dropdownValue.value !== 'custom' && dropdownValue.value === 'available'}
        icon={'👋'}
        onClick={async () => {
          setDropdownValue({
            value: 'available',
            textOption: 'Available',
            iconText: '👋'
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
        selected={dropdownValue.value !== 'custom' && dropdownValue.value === 'away'}
        icon={'🕓'}
        onClick={async () => {
          setDropdownValue({
            value: 'away',
            textOption: 'Away',
            iconText: '🕓'
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
        selected={dropdownValue.value !== 'custom' && dropdownValue.value === 'vacationing'}
        icon={'🌴'}
        onClick={async () => {
          setDropdownValue({
            value: 'vacationing',
            textOption: 'Vacationing',
            iconText: '🌴'
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
        selected={dropdownValue.value !== 'custom' && dropdownValue.value === 'working'}
        icon={'👨‍💻'}
        onClick={async () => {
          setDropdownValue({
            value: 'working',
            textOption: 'Working',
            iconText: '👨‍💻'
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
        selected={dropdownValue.value !== 'custom' && dropdownValue.value === 'traveling'}
        icon={'✈️'}
        onClick={async () => {
          setDropdownValue({
            value: 'traveling',
            textOption: 'Traveling',
            iconText: '✈️'
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
        selected={dropdownValue.value !== 'custom' && dropdownValue.value === 'celebrating'}
        icon={'🥂'}
        onClick={async () => {
          setDropdownValue({
            value: 'celebrating',
            textOption: 'Celebrating',
            iconText: '🥂'
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
        selected={dropdownValue.value !== 'custom' && dropdownValue.value === 'sick'}
        icon={'🤒'}
        onClick={async () => {
          setDropdownValue({
            value: 'sick',
            textOption: 'Sick',
            iconText: '🤒'
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
        selected={dropdownValue.value !== 'custom' && dropdownValue.value === 'noStatus'}
        icon={'💭'}
        onClick={async () => {
          setDropdownValue({
            value: 'noStatus',
            textOption: 'No Status',
            iconText: '💭'
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
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            ref={wrapperRefEmojis}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowEmojis(false);
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-lg">
              <EmojiPicker
                onEmojiSelect={(emojiObject) => {
                  setSelectedEmoji(emojiObject.native);
                  setShowEmojis(false);
                }}
                maxLength={20}
                currentInput={customStatus}
              />
            </div>
          </div>
        )}
        <div>
          <Input.Label className="flex mt-4 text-left text-[11px]" value="Custom Status" />
          <Input.Text
            className="h-[30px]"
            value={customStatus}
            placeholder="Add status"
            maxLength={12}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomStatus(e.target.value)}
            action={
              <div className="flex gap-2">
                {customStatus && selectedEmoji && (
                  <Button.Action
                    icon={<Icon.Plus size="18" />}
                    onClick={() => {
                      setDropdownValue({
                        value: 'custom',
                        textOption: customStatus,
                        iconText: selectedEmoji
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
                      event.preventDefault();
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
                      event.preventDefault();
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
    </>
  );
}
