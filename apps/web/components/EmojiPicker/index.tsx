import React from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
  maxLength?: number;
  currentInput?: string;
}

const EmojiPicker = ({
  onEmojiSelect,
  maxLength,
  currentInput,
}: EmojiPickerProps) => {
  return (
    <Picker
      theme="dark"
      data={data}
      onEmojiSelect={(emojiObject: any) => {
        if (maxLength && currentInput) {
          const emojiLength = new Blob([emojiObject.native]).size / 2;
          if (currentInput.length + emojiLength <= maxLength) {
            onEmojiSelect(emojiObject);
          }
        } else {
          onEmojiSelect(emojiObject);
        }
      }}
    />
  );
};

export default EmojiPicker;
