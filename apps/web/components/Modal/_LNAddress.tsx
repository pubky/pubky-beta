'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import QRCode from 'qrcode.react';
import Image from 'next/image';

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
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

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

  const checkPayment = () => {
    setCheckingPayment(true);
    setTimeout(() => {
      setCheckingPayment(false);
      setPaymentConfirmed(true);
    }, 3000);
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
      className={`w-[450px] ${
        paymentConfirmed &&
        `bg-cover bg-center bg-[url('/images/bg-confetti.gif')]`
      }`}
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      {paymentConfirmed ? (
        <div className="flex flex-col items-center">
          <Image
            alt="confirm"
            src="/images/confirm.png"
            height={356}
            width={256}
          />
          <Typography.Body variant="large-bold" className="mt-4">
            Payment successful
          </Typography.Body>
          <Typography.Body
            onClick={() => setPaymentConfirmed(false)}
            variant="small"
            className="cursor-pointer text-opacity-60 hover:text-opacity-80 underline underline-offset-1"
          >
            Send another
          </Typography.Body>
        </div>
      ) : (
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
              <div className="absolute inset-0 flex items-center justify-center">
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
              copiedLNAddress ? (
                <Icon.Check size="16" />
              ) : (
                <Icon.File size="16" />
              )
            }
            onClick={handleCopy}
          >
            {copiedLNAddress ? 'Copied' : 'Copy lightning address'}
          </Button.Medium>
          {checkingPayment ? (
            <div className="mt-2 flex gap-1 justify-center items-center">
              <Icon.LoadingSpin size="16" />{' '}
              <Typography.Body
                variant="small"
                className="cursor-pointer text-opacity-60 hover:text-opacity-80 underline underline-offset-1"
              >
                Loading
              </Typography.Body>
            </div>
          ) : (
            <Typography.Body
              onClick={checkPayment}
              variant="small"
              className="cursor-pointer mt-2 text-opacity-60 hover:text-opacity-80 underline underline-offset-1"
            >
              Check payment
            </Typography.Body>
          )}
        </div>
      )}
    </Modal.Root>
  );
}
