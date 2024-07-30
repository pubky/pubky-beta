'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import QRCode from 'qrcode.react';

interface LNAddressProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  lnAddress?: string;
}

export default function LNAddress({
  showModal,
  setShowModal,
  lnAddress,
}: LNAddressProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [copiedLNAddress, setCopiedLNAddress] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lnAddress || '');
      setCopiedLNAddress(true);
      setTimeout(() => {
        setCopiedLNAddress(false);
      }, 1000);
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalRef, setShowModal]);

  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalRef}
      className="w-[450px]"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="flex flex-col items-center">
        {lnAddress && (
          <div onClick={handleCopy} className="relative cursor-pointer">
            <QRCode
              value={lnAddress}
              size={256}
              level="H"
              className="rounded-lg"
              includeMargin={true}
              renderAs="svg"
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="p-2 bg-black rounded-full">
                <Icon.Lightning size="24" color="#D946EF" />
              </div>
            </div>
          </div>
        )}
        <Typography.Body variant="medium" className="text-opacity-80 mt-4">
          {lnAddress}
        </Typography.Body>
        <Button.Medium
          variant="line"
          className="mt-4"
          icon={
            copiedLNAddress ? <Icon.Check size="16" /> : <Icon.File size="16" />
          }
          onClick={handleCopy}
        >
          {copiedLNAddress ? 'Copied' : 'Copy lightning address'}
        </Button.Medium>
      </div>
    </Modal.Root>
  );
}
