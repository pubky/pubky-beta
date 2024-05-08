'use client';

import { Icon, Input, Modal } from '@social/ui-shared';
import { useState } from 'react';

interface LinkProps {
  showModalLink: boolean;
  setShowModalLink: React.Dispatch<React.SetStateAction<boolean>>;
  modalLinkRef: React.RefObject<HTMLDivElement>;
  onAddLink: (title: string, url: string) => void;
}

export default function Link({
  showModalLink,
  setShowModalLink,
  modalLinkRef,
  onAddLink,
}: LinkProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const disabled = !url || !title;

  const handleClipboardClick = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setUrl(clipboardText);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const handleAddLink = () => {
    onAddLink(title, url);
    setShowModalLink(false);
    setTitle('');
    setUrl('');
  };
  return (
    <Modal.Root
      show={showModalLink}
      closeModal={() => setShowModalLink(false)}
      modalRef={modalLinkRef}
      className="w-[480px]"
    >
      <Modal.CloseAction onClick={() => setShowModalLink(false)} />
      <Modal.Header title="Add Profile Link" />
      <div className="my-6 flex-col inline-flex gap-4">
        <div>
          <Input.Label value="Label" />
          <Input.Text
            placeholder="Add label"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </div>
        <div>
          <Input.Label value="Url" />
          <Input.Text
            placeholder="Add url"
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUrl(e.target.value)
            }
            action={
              <div className="cursor-pointer" onClick={handleClipboardClick}>
                <Icon.Clipboard />
              </div>
            }
          />
        </div>
      </div>
      <div className="w-full mt-4">
        <Modal.SubmitAction
          icon={
            <Icon.LinkSimple size="16" color={disabled ? 'grey' : 'white'} />
          }
          onClick={!disabled ? handleAddLink : undefined}
          disabled={disabled}
        >
          Add link
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
