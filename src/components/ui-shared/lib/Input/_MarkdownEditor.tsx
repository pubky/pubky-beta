'use client';

import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image']
  ]
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'align',
  'list',
  'blockquote',
  'code-block',
  'link',
  'image'
];

interface MarkdownEditorComponentProps {
  id: string;
  placeHolder: string;
  autoFocus: boolean;
  onChange: (text: string) => void;
  setCharCount: (count: number) => void;
  value: string;
  maxLength: number;
}

const MarkdownEditorComponent = ({
  id,
  placeHolder,
  autoFocus,
  onChange,
  setCharCount,
  value,
  maxLength
}: MarkdownEditorComponentProps) => {
  const { quill, quillRef } = useQuill({
    modules,
    formats,
    placeholder: placeHolder
  });

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        let text = quill.getText();

        if (text === '\n') {
          text = '';
        }

        if (text.endsWith('\n')) {
          text = text.slice(0, -1);
        }

        if (text.length <= maxLength) {
          setCharCount(text.length);
          onChange(text);
        } else {
          quill.deleteText(maxLength, quill.getLength());
        }
      });
    }
  }, [quill, onChange, maxLength]);

  useEffect(() => {
    if (quill && autoFocus) quill.focus();
  }, [quill, autoFocus]);

  useEffect(() => {
    if (quill && value !== quill.getText().trim()) {
      const currentSelection = quill.getSelection();
      quill.setText(value);
      if (currentSelection) {
        quill.setSelection(currentSelection.index);
      }
    }
  }, [value, quill]);

  return (
    <div className="w-full relative mt-4">
      <div id={id} ref={quillRef} className="min-h-[200px]" />
    </div>
  );
};

export default MarkdownEditorComponent;
