import React from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

interface CursorAreaProps {
  children?: string;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
  placeHolder?: string;
  onChange: (value: { text: string }) => void;
  autoFocus?: boolean;
  value: string;
}

const mdParser = new MarkdownIt();

export const MarkdownEditor = ({
  onChange,
  value,
  children,
  error,
  maxLength,
  disabled,
  placeHolder,
  autoFocus,
  ...rest
}: CursorAreaProps) => {
  return (
    <div>
      <MdEditor
        value={value}
        style={{ height: '400px' }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={onChange}
        autoFocus={autoFocus}
        placeholder={placeHolder}
        config={{
          view: {
            menu: true,
            md: true,
            html: true,
          },
        }}
        className="dark-editor mt-4"
      />
    </div>
  );
};
