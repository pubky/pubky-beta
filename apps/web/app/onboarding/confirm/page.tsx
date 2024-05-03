'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Icon, Typography } from '@social/ui-shared';
import { Onboarding } from '../components';
import Image from 'next/image';
import Link from 'next/link';
import { Modal } from '../../components/Modal';

export default function Index() {
  const [showModalBackup, setShowModalBackup] = useState(false);
  const modalBackupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalBackupRef.current &&
        !modalBackupRef.current.contains(event.target as Node)
      ) {
        setShowModalBackup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalBackupRef, setShowModalBackup]);
  return (
    <>
      <Onboarding.Layout currentStep={4}>
        <Typography.Display>Ready to go!</Typography.Display>
        <Typography.PageTitle className="text-opacity-50 mt-4 lg:mt-0">
          Welcome to Pubky. Your keys, your content, your rules.
        </Typography.PageTitle>
        <div className="my-12 w-full h-[434px] sm:h-[534px] p-8 bg-transparent rounded-2xl shadow border border-white border-opacity-20 backdrop-blur-[50px] flex-col justify-center items-center gap-8 inline-flex">
          <div className="flex-col justify-center items-center flex">
            <Image
              width={284}
              height={284}
              src="/images/confirm.png"
              alt="confirm"
              className="scale-75 sm:scale-100"
            />
          </div>
        </div>
        <div className="w-full max-w-[1200px] justify-between items-center inline-flex">
          <Link href="/onboarding/pubky">
            <Button.Large
              icon={<Icon.ArrowLeft />}
              className="w-[170px]"
              variant="secondary"
            >
              Back
            </Button.Large>
          </Link>
          <Button.Large
            icon={<Icon.Lock />}
            className="w-[250px]"
            variant="secondary"
            onClick={() => setShowModalBackup(true)}
          >
            Backup account
          </Button.Large>
          <Link href="/home">
            <Button.Large icon={<Icon.ArrowRight />} className="w-[170px] z-20">
              Start Exploring
            </Button.Large>
          </Link>
        </div>
      </Onboarding.Layout>
      <Modal.Backup
        showModalBackup={showModalBackup}
        setShowModalBackup={setShowModalBackup}
        modalBackupRef={modalBackupRef}
      />
    </>
  );
}
