'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { Icon } from '../Icon';
import { renderToString } from 'react-dom/server';
import EmojiPicker from '@/components/EmojiPicker';
import { Delta } from 'quill';
import { Utils } from '@/components/utils-shared';
import { useAlertContext } from '@/contexts';

// Add custom CSS for the emoji button
const customStyles = `
  .ql-emoji:after {
    content: "";
    font-size: 18px;
    line-height: 1;
  }
  .ql-emoji svg {
    width: 24px;
    height: 24px;
  }
  .ql-editor span {
    display: inline-block;
  }
  .ql-editor p {
    display: block;
  }
`;

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['emoji']
    ],
    handlers: {
      emoji: function () {
        // This will be handled by the emoji picker
      }
    }
  },
  clipboard: {
    matchVisual: false
  },
  keyboard: {
    bindings: {
      enter: {
        key: 13,
        handler: function (range: any) {
          const quill = this.quill;
          const delta = new Delta().retain(range.index).delete(range.length).insert('\n');
          quill.updateContents(delta, 'user');
          quill.setSelection(range.index + 1, 0);
          quill.focus();
          return false;
        }
      }
    }
  }
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
  'link'
];

interface MarkdownEditorComponentProps {
  id: string;
  placeHolder: string;
  autoFocus: boolean;
  onChange: (html: string) => void;
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
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const { addAlert, removeAlert } = useAlertContext();

  const handleEmojiClick = (emoji: any) => {
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        quill.insertText(range.index, emoji.native);
        quill.setSelection(range.index + emoji.native.length);
        onChange(quill.root.innerHTML);
        setCharCount(quill.getText().length);
      }
    }
  };

  // Custom handler for image upload
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const loadingAlertId = addAlert('Compressing image...', 'loading');
          const resizedBase64 = await Utils.resizeImageFile(file);
          removeAlert(loadingAlertId);

          if (quill) {
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, 'image', resizedBase64, 'user');
            }
          }
        } catch (err) {
          // Optionally handle error
          console.error('Image upload error:', err);
          addAlert('Error uploading image. Please try again.', 'warning');
        }
      }
    };
  };

  useEffect(() => {
    // Add custom styles to the document
    const style = document.createElement('style');
    style.innerHTML = customStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const { quill, quillRef } = useQuill({
    modules,
    formats,
    placeholder: placeHolder
  });

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        let html = quill.root.innerHTML;
        let text = quill.getText();

        let imgTagLength = 0;
        const imgTagRegex = /<img[^>]*\/?\>/g;
        let match;
        while ((match = imgTagRegex.exec(html)) !== null) {
          imgTagLength += match[0].length;
        }
        const totalCharCount = text.length + imgTagLength;

        if (text.length <= maxLength) {
          setCharCount(totalCharCount);
          onChange(html);
        } else {
          quill.deleteText(maxLength, quill.getLength());
        }
      });

      // Add custom emoji button
      const toolbar = quill.getModule('toolbar') as { addHandler: (name: string, handler: () => void) => void };
      toolbar.addHandler('emoji', () => {
        setShowEmojis(true);
      });
      // Add custom image handler
      toolbar.addHandler('image', imageHandler);

      // Set custom icon for emoji button
      const emojiButton = document.querySelector('.ql-emoji');
      if (emojiButton) {
        emojiButton.innerHTML = renderToString(<Icon.Smiley size="24" />);
      }
    }
  }, [quill, onChange, maxLength]);

  useEffect(() => {
    if (quill && autoFocus) quill.focus();
  }, [quill, autoFocus]);

  useEffect(() => {
    if (quill && value !== quill.root.innerHTML) {
      const currentSelection = quill.getSelection();
      quill.root.innerHTML = value;
      if (currentSelection) {
        quill.setSelection(currentSelection.index);
      }
    }
  }, [value, quill]);

  return (
    <div className="w-full relative mt-4">
      <div id={id} ref={quillRef} className="min-h-[200px]" />
      {showEmojis && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-[9998]" onClick={() => setShowEmojis(false)} />
          <div
            id="emoji-picker"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white shadow-lg"
            ref={wrapperRefEmojis}
          >
            <EmojiPicker onEmojiSelect={handleEmojiClick} maxLength={maxLength} currentInput={value} />
          </div>
        </>
      )}
    </div>
  );
};

export default MarkdownEditorComponent;
