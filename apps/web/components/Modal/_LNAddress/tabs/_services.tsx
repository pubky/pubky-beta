'use client';

import { useState } from 'react';
import DropDown from '@/components/DropDown';
import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import { IService } from '@/types';

interface ServicesProps {
  lnAddress?: string;
  paymentConfirmed: boolean;
  setPaymentConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  services: IService[] | undefined;
}

export default function Services({
  lnAddress,
  paymentConfirmed,
  setPaymentConfirmed,
  services,
}: ServicesProps) {
  const [openServiceId, setOpenServiceId] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [copiedLNAddress, setCopiedLNAddress] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  const toggleServiceOpen = (index: number) => {
    setOpenServiceId(openServiceId === index ? null : index);
  };

  const buyService = (index: number) => {
    setSelectedService(index);
    setPaymentConfirmed(false);
  };

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

  return (
    <>
      <Modal.Header title="Products & Services" />
      <div className="mt-4 flex">
        {selectedService === null ? (
          <div className="w-full">
            {services && services.length > 0 ? (
              services.map((service, index) => (
                <DropDown.Service
                  key={index}
                  title={service.title}
                  price={service.price}
                  description={service.description}
                  open={openServiceId === index}
                  setOpen={() => toggleServiceOpen(index)}
                  buyService={() => buyService(index)}
                />
              ))
            ) : (
              <Typography.Body className="text-center text-opacity-50 mt-6">
                No services yet
              </Typography.Body>
            )}
          </div>
        ) : (
          <div className="flex w-full">
            <div className="w-1/2 p-4">
              {paymentConfirmed ? (
                <div
                  className={
                    "rounded-lg bg-cover bg-center bg-[url('/images/bg-confetti.gif')]"
                  }
                >
                  <div className="flex flex-col items-center">
                    <Image
                      alt="confirm"
                      src="/images/confirm.png"
                      height={256}
                      width={156}
                    />
                    <Typography.Body variant="large-bold" className="mt-4">
                      Payment sent successfully
                    </Typography.Body>
                    <Typography.Body
                      onClick={() => setSelectedService(null)}
                      variant="small"
                      className="cursor-pointer text-opacity-60 hover:text-opacity-80 underline underline-offset-1"
                    >
                      Buy another service
                    </Typography.Body>
                  </div>
                </div>
              ) : (
                <>
                  {lnAddress && (
                    <div
                      onClick={handleCopy}
                      className="flex justify-center relative cursor-pointer"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-2 bg-black rounded-full">
                          <Icon.Lightning size="24" color="#D946EF" />
                        </div>
                      </div>
                      <QRCode
                        value={lnAddress}
                        size={256}
                        level="H"
                        className="rounded-lg"
                        includeMargin={true}
                        renderAs="svg"
                      />
                    </div>
                  )}
                  <Typography.Body
                    variant="medium"
                    className="text-opacity-80 mt-4"
                  >
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
                      Sent payment?
                    </Typography.Body>
                  )}
                </>
              )}
            </div>
            <div className="w-1/2 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center w-full justify-between">
                  <Typography.Body className="text-left" variant="large-bold">
                    {services && services[selectedService].title}
                  </Typography.Body>
                  <Typography.Body
                    className="text-left text-opacity-80"
                    variant="small-bold"
                  >
                    {services && services[selectedService].price}btc
                  </Typography.Body>
                </div>
                <Typography.Body
                  className="text-left text-opacity-80"
                  variant="small"
                >
                  {services && services[selectedService].description}
                </Typography.Body>
                {paymentConfirmed && (
                  <div className="mt-8 flex flex-col gap-2">
                    <Typography.Body className="text-left" variant="large-bold">
                      How to contact the user?
                    </Typography.Body>

                    <Typography.Body
                      className="text-left text-opacity-80"
                      variant="small"
                    >
                      {services && services[selectedService].contact}
                    </Typography.Body>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
