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
    ['link', 'image'],
  ],
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
  'image',
];

const MarkdownEditorComponent = ({
  placeHolder,
  autoFocus,
  onChange,
  setCharCount,
  value,
  isError,
  maxLength,
}) => {
  const { quill, quillRef } = useQuill({
    modules,
    formats,
    placeholder: placeHolder,
  });

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        const text = quill.getText().trim();
        if (text.length <= maxLength) {
          setCharCount(text.length);
          onChange(quill.root.innerHTML);
        } else {
          quill.deleteText(maxLength, quill.getLength());
        }
      });
    }
  }, [quill, onChange, maxLength]);

  useEffect(() => {
    if (quill && autoFocus) quill.focus();
  }, []);

  useEffect(() => {
    if (quill && value !== quill.root.innerHTML) {
      quill.root.innerHTML = value;
    }
  }, [value, quill]);

  const errorCSS = 'text-red-500 text-sm mt-2';

  return (
    <div className="w-full relative">
      <div ref={quillRef} className="min-h-[200px]" />
      {isError && (
        <div className={errorCSS}>Max length {maxLength} reached</div>
      )}
    </div>
  );
};

export default MarkdownEditorComponent;
