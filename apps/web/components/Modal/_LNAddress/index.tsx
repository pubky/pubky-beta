'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Modal, Typography } from '@social/ui-shared';
import Tab from './tabs';
import { IService } from '@/types';

interface LNAddressProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  lnAddress?: string;
  services?: IService[];
}

export default function LNAddress({
  showModal,
  setShowModal,
  lnAddress,
  services,
}: LNAddressProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [donationConfirmed, setDonationConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'donation'>(
    'services'
  );

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return (
          <Tab.Services
            lnAddress={lnAddress}
            paymentConfirmed={paymentConfirmed}
            setPaymentConfirmed={setPaymentConfirmed}
            services={services}
          />
        );
      case 'donation':
        return (
          <Tab.Donation
            lnAddress={lnAddress}
            donationConfirmed={donationConfirmed}
            setDonationConfirmed={setDonationConfirmed}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalRef}
      className={`${
        activeTab === 'services' ? 'w-[792px]' : 'w-auto'
      } min-w-[458px] max-w-[792px] max-h-[650px]`}
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      {renderTabContent()}
      <div className="-mb-8 mt-8 flex gap-4">
        <div
          onClick={() => setActiveTab('services')}
          className={`w-full h-12 px-3 border-b-2 justify-center items-center gap-2 inline-flex cursor-pointer ${
            activeTab === 'services'
              ? 'border-white'
              : 'border-white border-opacity-10 hover:border-opacity-50'
          }`}
        >
          <Icon.Product size="16" />
          <Typography.Caption className="tracking-normal" variant="bold">
            Product & Services
          </Typography.Caption>
        </div>
        <div
          onClick={() => setActiveTab('donation')}
          className={`w-full h-12 px-3 border-b-2 justify-center items-center gap-2 inline-flex cursor-pointer ${
            activeTab === 'donation'
              ? 'border-white'
              : 'border-white border-opacity-10 hover:border-opacity-50'
          }`}
        >
          <Icon.Donation size="16" />
          <Typography.Caption className="tracking-normal" variant="bold">
            Donation
          </Typography.Caption>
        </div>
      </div>
    </Modal.Root>
  );
}
