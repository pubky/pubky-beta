import MarkdownEditor from '@uiw/react-markdown-editor';

interface MarkdownEditorProps {
  placeHolder?: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  value: string;
  isError?: boolean;
}

export const MarkdownEditorComponent = ({
  onChange,
  value,
  placeHolder,
  autoFocus,
  isError,
  ...rest
}: MarkdownEditorProps) => {
  const errorCSS = `text-red-500 text-sm mt-2`;

  return (
    <div className="w-full relative">
      <MarkdownEditor
        value={value}
        visible
        onChange={onChange}
        height="400px"
        className="mt-2"
        placeholder={placeHolder}
        autoFocus={autoFocus}
        {...rest}
      />
      {isError && <div className={errorCSS}>Max length 1000</div>}
    </div>
  );
};
