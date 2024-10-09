'use client';

import {
  Button,
  Card,
  Icon,
  Input,
  Modal,
  Typography,
} from '@social/ui-shared';
import { useState } from 'react';

interface BackupProps {
  loading: boolean;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => Promise<void>;
  showModalBackup: boolean;
  setShowModalBackup: React.Dispatch<React.SetStateAction<boolean>>;
  modalBackupRef: React.RefObject<HTMLDivElement>;
  errors: string;
}

export default function Backup({
  loading,
  setPassword,
  handleSubmit,
  showModalBackup,
  setShowModalBackup,
  modalBackupRef,
  errors,
}: BackupProps) {
  const [phrase, setPhrase] = useState(false);
  const [file, setFile] = useState(false);
  const [showWords, setShowWords] = useState(false);
  return (
    <Modal.Root
      show={showModalBackup}
      closeModal={() => {
        setShowModalBackup(false);
        setShowWords(false);
      }}
      modalRef={modalBackupRef}
      className="md:max-w-[792px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalBackup(false);
          setShowWords(false);
        }}
      />
      <Modal.Header title="Back up your account" />
      {phrase ? (
        <>
          <Typography.Body
            className="text-opacity-80 mt-2"
            variant="medium-light"
          >
            Use the 12 words below to recover your account at a later date.
            Write down these words in the right order and store them in a safe
            place. Never share this recovery phrase with anyone as this may
            result in the loss of your account.
          </Typography.Body>
          <div className="my-4">
            <Typography.H2 className="mb-4">
              Write down Recovery Phrase
            </Typography.H2>
            <div
              className={`${
                !showWords && 'blur-[10px]'
              } w-full p-12 bg-white bg-opacity-10 rounded-2xl justify-start items-start gap-12 inline-flex`}
            >
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">1. </span>{' '}
                  negative
                </Typography.Body>
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">2. </span>{' '}
                  inquiry
                </Typography.Body>
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">3. </span> swamp
                </Typography.Body>
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">4. </span> purity
                </Typography.Body>
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">5. </span> carbon
                </Typography.Body>
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">6. </span> actual
                </Typography.Body>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">7. </span> march
                </Typography.Body>
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">8. </span> enemy
                </Typography.Body>
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">9. </span> clinic
                </Typography.Body>
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">10. </span> armed
                </Typography.Body>
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">11. </span> exact
                </Typography.Body>
                <Typography.Body variant="medium-bold">
                  <span className="text-white text-opacity-50">12. </span> fog
                </Typography.Body>
              </div>
            </div>
          </div>
          <div className="w-full max-w-[796px] mt-4 justify-between items-center inline-flex">
            <Button.Large
              icon={<Icon.ArrowLeft />}
              className="w-auto"
              variant="secondary"
              onClick={() => {
                setPhrase(false);
                setShowWords(false);
              }}
            >
              Back
            </Button.Large>
            <Button.Large
              icon={showWords ? <Icon.ArrowRight /> : <Icon.Eye />}
              onClick={
                showWords
                  ? () => setShowModalBackup(false)
                  : () => setShowWords(true)
              }
              className="w-auto"
            >
              {showWords ? 'Confirm Recovery Phrase' : 'Reveal Recovery Phrase'}
            </Button.Large>
          </div>
        </>
      ) : file ? (
        <>
          <Typography.Body
            className="text-opacity-80 mt-2"
            variant="medium-light"
          >
            Encrypt your recovery file below with a secure password, download
            it, and save it to your computer or your cloud provider. Never share
            this file and password with anyone.
          </Typography.Body>
          <div className="my-4">
            <Typography.H2 className="mb-4">
              Recovery File Password
            </Typography.H2>
            <Input.Label className="mt-4" value="Password" />
            <Input.Text
              id="backup-recovery-file-password-input"
              className="h-[70px] mt-1"
              type="password"
              error={errors}
              placeholder="••••••••••••"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <div className="w-full max-w-[796px] mt-4 justify-between items-center inline-flex">
            <Button.Large
              icon={<Icon.ArrowLeft />}
              className="w-auto"
              variant="secondary"
              onClick={() => setFile(false)}
            >
              Back
            </Button.Large>
            <Button.Large
              id="backup-download-recovery-file-btn"
              icon={<Icon.DownloadSimple />}
              onClick={!loading ? () => handleSubmit() : undefined}
              loading={loading}
              className="w-auto"
            >
              Download Recovery File
            </Button.Large>
          </div>
        </>
      ) : (
        <>
          <Typography.Body
            className="text-opacity-80 my-4"
            variant="medium-light"
          >
            Please choose how you want to back up your account. For security
            reasons, your recovery phrase or recovery file{' '}
            <strong className="font-bold text-white text-opacity-100">
              will be deleted once you complete the backup.
            </strong>
          </Typography.Body>
          <div className="flex gap-6">
            <Card.Primary
              title="Recovery Phrase"
              text="Write down 12 words to recover your account at a later date."
            >
              <div className="flex justify-center items-center my-10">
                <Icon.FileText size="128" />
              </div>
              <Button.Large
                icon={<Icon.FileText color="gray" />}
                disabled
                // onClick={() => setPhrase(true)}
              >
                Recovery Phrase
              </Button.Large>
            </Card.Primary>
            <Card.Primary
              title="Recovery File"
              text="Download a password encrypted, digital file to your computer."
            >
              <div className="flex justify-center items-center my-10">
                <Icon.DownloadSimple size="128" />
              </div>
              <Button.Large
                id="backup-recovery-file-btn"
                icon={<Icon.DownloadSimple />}
                onClick={() => setFile(true)}
              >
                Recovery File
              </Button.Large>
            </Card.Primary>
          </div>
        </>
      )}
    </Modal.Root>
  );
}
