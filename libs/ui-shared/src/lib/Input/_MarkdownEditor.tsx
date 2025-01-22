'use client';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditorComponent from 'react-froala-wysiwyg';

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
  const errorCSS = `text-red-500 text-sm mt-2`;

  // Config
  const config = {
    heightMin: 400,
    placeholderText: placeHolder,
    charCounterCount: maxLength ? true : false,
    charCounterMax: maxLength,
    imageInsertButtons: ['imageByURL'],
    imageUpload: false,
    quickInsertEnabled: false,
    toolbarButtons: [
      'bold',
      'italic',
      'underline',
      'fontSize',
      '|',
      'align',
      'formatOL',
      'formatUL',
      'paragraphFormat',
      '|',
      'insertLink',
      'insertImage',
      '|',
      'undo',
      'redo',
      'html',
    ],
    linkAlwaysBlank: true,
    events: {
      contentChanged: function (_: any, editor: any) {
        try {
          if (editor && editor.html) {
            onChange(editor.html.get());
          }
        } catch (error) {
          console.error('Error handling content:', error);
        }
      },
    },
    autofocus: autoFocus,
    theme: 'dark',
  };

  return (
    <div className="w-full relative mt-4">
      <FroalaEditorComponent
        tag="textarea"
        config={config}
        model={value}
        onModelChange={(newValue: string) => onChange(newValue)}
        {...rest}
      />
      {isError && <div className={errorCSS}>Max length {maxLength}</div>}
    </div>
  );
};
