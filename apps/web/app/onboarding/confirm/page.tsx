'use client';

import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { Button, Icon, Tooltip, Typography } from '@social/ui-shared';
import { useClientContext } from '../../../contexts/client';
import { Onboarding } from '../components';
import Image from 'next/image';
import Link from 'next/link';
import { Modal } from '../../../components/Modal';
import { Utils } from '../../../utils';

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export default function Index() {
  const { seed, setSeed, getRecoveryFile } = useClientContext();
  const [showModalBackup, setShowModalBackup] = useState(false);
  const [disposableAccount, setDisposableAccount] = useState(false);
  const modalBackupRef = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState(false);

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

  useEffect(() => {
    if (seed) {
      setDisposableAccount(true);
    } else {
      setDisposableAccount(false);
    }
  }, [seed]);

  const handleDownloadRecoveryFile = async ({
    recoveryFile,
    filename,
  }: {
    recoveryFile: Buffer;
    filename: string;
  }) => {
    try {
      const element = document.createElement('a');

      const fileBlob = new Blob([recoveryFile]);

      element.href = URL.createObjectURL(fileBlob);
      element.download = filename;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();

      setSeed(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setErrors('');

      const result = passwordSchema.safeParse({
        password,
      });

      if (!result.success) {
        setErrors(result.error.errors.map((err) => err.message).join(', '));
        setLoading(false);
        return;
      }
      const recoveryFileResponse = await getRecoveryFile(password);

      if (!recoveryFileResponse) {
        throw new Error('Something went wrong');
      }

      const { recoveryFile, filename } = recoveryFileResponse;
      await handleDownloadRecoveryFile({ recoveryFile, filename });
      Utils.storage.remove('seed');
      setShowModalBackup(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
          <Tooltip.Root setShowTooltip={setShowTooltip}>
            <Button.Large
              icon={<Icon.Lock color={disposableAccount ? ' white' : 'gray'} />}
              disabled={!disposableAccount}
              onClick={
                disposableAccount ? () => setShowModalBackup(true) : undefined
              }
              className="w-[250px]"
              variant="secondary"
            >
              Backup account
            </Button.Large>
            {showTooltip && !seed && (
              <Tooltip.Small>
                <Typography.Body variant="small" className="text-opacity-80">
                  You have already done the backup,{' '}
                  <span className="text-white font-bold text-opacity-100">
                    your seed has been deleted
                  </span>
                  .
                </Typography.Body>
              </Tooltip.Small>
            )}
          </Tooltip.Root>
          <Link href="/home">
            <Button.Large icon={<Icon.ArrowRight />} className="w-[170px] z-20">
              Start Exploring
            </Button.Large>
          </Link>
        </div>
      </Onboarding.Layout>
      <Modal.Backup
        loading={loading}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        showModalBackup={showModalBackup}
        setShowModalBackup={setShowModalBackup}
        modalBackupRef={modalBackupRef}
        errors={errors}
      />
    </>
  );
}
