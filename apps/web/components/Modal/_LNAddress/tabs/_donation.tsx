'use client';

import { useState } from 'react';
import { Button, Icon, Typography } from '@social/ui-shared';
import QRCode from 'qrcode.react';
import Image from 'next/image';

interface DonationProps {
  lnAddress?: string;
  donationConfirmed: boolean;
  setDonationConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Donation({
  lnAddress,
  donationConfirmed,
  setDonationConfirmed,
}: DonationProps) {
  const [copiedLNAddress, setCopiedLNAddress] = useState(false);
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
      setDonationConfirmed(true);
    }, 3000);
  };

  return (
    <div
      className={`${
        donationConfirmed &&
        `rounded-lg bg-cover bg-center`
      }`}
    >
      {donationConfirmed ? (
        <div className="flex flex-col items-center">
          <Image
            alt="confirm"
            src="/images/confirm.png"
            height={356}
            width={256}
          />
          <Typography.Body variant="large-bold" className="mt-4">
            Donation sent successfully
          </Typography.Body>
          <Typography.Body
            onClick={() => setDonationConfirmed(false)}
            variant="small"
            className="cursor-pointer text-opacity-60 hover:text-opacity-80 underline underline-offset-1"
          >
            Send another donation
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
              Sent donation?
            </Typography.Body>
          )}
        </div>
      )}
    </div>
  );
}