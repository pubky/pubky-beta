'use client';

import { usePubkyClientContext } from '@/contexts';
import { Button, Icon, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import ConfirmPhrase from './_ConfirmPhrase';

interface PhraseProps {
  setShowModalBackup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBackupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
  setPhrase: React.Dispatch<React.SetStateAction<boolean>>;
  confirmPhrase: boolean;
  setConfirmPhrase: React.Dispatch<React.SetStateAction<boolean>>;
  showWords: boolean;
  setShowWords: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Phrase({
  setShowModalBackup,
  setShowBackupSuccess,
  setPhrase,
  confirmPhrase,
  setConfirmPhrase,
  showWords,
  setShowWords,
}: PhraseProps) {
  const { mnemonic } = usePubkyClientContext();
  const [copyMnemonic, setCopyMnemonic] = useState(false);
  const [randomizedWords, setRandomizedWords] = useState<string[]>([]);
  const [isCorrectOrder, setIsCorrectOrder] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>(
    Array(12).fill('')
  );
  const correctOrder = mnemonic?.split(' ') || [];

  useEffect(() => {
    if (
      selectedWords.length === correctOrder.length &&
      selectedWords.every((word, index) => word === correctOrder[index])
    ) {
      setIsCorrectOrder(true);
    } else {
      setIsCorrectOrder(false);
    }
  }, [selectedWords, correctOrder]);

  useEffect(() => {
    if (mnemonic) {
      setRandomizedWords(mnemonic.split(' ').sort(() => Math.random() - 0.5));
    }
  }, [mnemonic]);

  const handleCopyMnemonicToClipboard = () => {
    if (mnemonic) {
      navigator.clipboard
        .writeText(mnemonic)
        .then(() => {
          setCopyMnemonic(true);
          setTimeout(() => {
            setCopyMnemonic(false);
          }, 1000);
        })
        .catch((err) => {
          console.error('Failed to copy to clipboard: ', err);
        });
    }
  };

  const handleDownloadRecoveryPhraseTXT = () => {
    if (mnemonic) {
      const fileName = 'pubky_recoveryphrase.txt';
      const fileContent = mnemonic;

      const blob = new Blob([fileContent], { type: 'text/plain' });
      const link = document.createElement('a');

      link.href = URL.createObjectURL(blob);
      link.download = fileName;

      link.click();
    }
  };

  return (
    <>
      {confirmPhrase ? (
        <ConfirmPhrase
          setShowModalBackup={setShowModalBackup}
          setShowBackupSuccess={setShowBackupSuccess}
          setConfirmPhrase={setConfirmPhrase}
          randomizedWords={randomizedWords}
          setRandomizedWords={setRandomizedWords}
          isCorrectOrder={isCorrectOrder}
          setIsCorrectOrder={setIsCorrectOrder}
          selectedWords={selectedWords}
          setSelectedWords={setSelectedWords}
        />
      ) : (
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
              } relative w-full p-12 bg-white bg-opacity-10 rounded-2xl justify-start items-start gap-12 inline-flex`}
            >
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                {mnemonic
                  ?.split(' ')
                  .slice(0, 6)
                  .map((word, index) => (
                    <Typography.Body key={index} variant="medium-bold">
                      <span className="text-white text-opacity-50">
                        {index + 1}.{' '}
                      </span>{' '}
                      {word}
                    </Typography.Body>
                  ))}
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                {mnemonic
                  ?.split(' ')
                  .slice(6, 12)
                  .map((word, index) => (
                    <Typography.Body key={index} variant="medium-bold">
                      <span className="text-white text-opacity-50">
                        {index + 7}.{' '}
                      </span>{' '}
                      {word}
                    </Typography.Body>
                  ))}
              </div>
              {showWords && (
                <div className="absolute bottom-3 right-5 flex gap-4">
                  <div
                    onClick={handleCopyMnemonicToClipboard}
                    className="flex gap-1 items-center cursor-pointer opacity-50 hover:opacity-80"
                  >
                    {copyMnemonic ? (
                      <Icon.Check size="12" />
                    ) : (
                      <Icon.Clipboard size="12" />
                    )}
                    <Typography.Body variant="small-bold">
                      Copy to clipboard
                    </Typography.Body>
                  </div>
                  <div
                    onClick={handleDownloadRecoveryPhraseTXT}
                    className="flex gap-1 items-center cursor-pointer opacity-50 hover:opacity-80"
                  >
                    <Icon.DownloadSimple size="12" />
                    <Typography.Body variant="small-bold">
                      Download
                    </Typography.Body>
                  </div>
                </div>
              )}
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
                  ? () => setConfirmPhrase(true)
                  : () => setShowWords(true)
              }
              className="w-auto"
            >
              {showWords ? 'Confirm Recovery Phrase' : 'Reveal Recovery Phrase'}
            </Button.Large>
          </div>
        </>
      )}
    </>
  );
}
