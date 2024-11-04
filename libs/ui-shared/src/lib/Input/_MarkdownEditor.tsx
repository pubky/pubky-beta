import React from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
//import '@uiw/react-markdown-editor/dist/style.css';

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

export const MarkdownEditorComponent = ({
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
    <div className="dark-editor">
      <MarkdownEditor
        value={value}
        //onChange={(editor, data, value) => onChange({ text: value })}
        height="400px"
        autoFocus={autoFocus}
        {...rest}
      />
    </div>
  );
};
