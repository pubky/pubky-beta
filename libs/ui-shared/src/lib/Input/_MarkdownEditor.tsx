'use client';

import {
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnUndo,
  BtnRedo,
  createButton,
} from 'react-simple-wysiwyg';
import { Icon } from '../Icon';

const BtnAlignLeft = createButton(
  'Align left',
  <div>
    <Icon.TextAlignLeft size="20" />
  </div>,
  'justifyLeft',
);
const BtnAlignCenter = createButton(
  'Align center',
  <div>
    <Icon.TextAlignCenter size="20" />
  </div>,
  'justifyCenter',
);
const BtnAlignRight = createButton(
  'Align right',
  <div>
    <Icon.TextAlignRight size="20" />
  </div>,
  'justifyRight',
);

const BtnClearContent = ({ onClear }: { onClear: () => void }) => (
  <button
    type="button"
    onClick={onClear}
    className="custom-btn"
    title="Clear content"
  >
    <div className="h-[2em] w-[2em] ml-1 -mt-[1px] hover:bg-[#ffffff29] flex items-center">
      <Icon.X size="16" />
    </div>
  </button>
);

interface MarkdownEditorProps {
  placeHolder?: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  value: string;
  isError?: boolean;
  maxLength?: number;
}

export const MarkdownEditorComponent = ({
  onChange,
  value,
  placeHolder,
  autoFocus,
  isError,
  maxLength,
  ...rest
}: MarkdownEditorProps) => {
  const errorCSS = 'text-red-500 text-sm mt-2';

  const handleClearContent = () => {
    onChange('');
  };

  return (
    <div className="w-full relative">
      <EditorProvider>
        <Editor
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeHolder}
          autoFocus={autoFocus}
          {...rest}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <div className="ml-2 flex items-center">
              <BtnAlignLeft />
              <BtnAlignCenter />
              <BtnAlignRight />
            </div>
            <BtnUndo />
            <BtnRedo />
            <BtnClearContent onClear={handleClearContent} />
          </Toolbar>
        </Editor>
      </EditorProvider>
      {isError && <div className={errorCSS}>Max length {maxLength}</div>}
    </div>
  );
};
