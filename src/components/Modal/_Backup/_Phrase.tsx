'use client';

import { usePubkyClientContext } from '@/contexts';
import { Button, Icon, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import ConfirmPhrase from './_ConfirmPhrase';

interface PhraseProps {
  setShowBackupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
  setPhrase: React.Dispatch<React.SetStateAction<boolean>>;
  confirmPhrase: boolean;
  setConfirmPhrase: React.Dispatch<React.SetStateAction<boolean>>;
  showWords: boolean;
  setShowWords: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Phrase({
  setShowBackupSuccess,
  setPhrase,
  confirmPhrase,
  setConfirmPhrase,
  showWords,
  setShowWords,
  setSuccess
}: PhraseProps) {
  const { mnemonic } = usePubkyClientContext();
  const [copyMnemonic, setCopyMnemonic] = useState(false);
  const [randomizedWords, setRandomizedWords] = useState<string[]>([]);
  const [isCorrectOrder, setIsCorrectOrder] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>(Array(12).fill(''));
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
          setShowBackupSuccess={setShowBackupSuccess}
          setConfirmPhrase={setConfirmPhrase}
          randomizedWords={randomizedWords}
          setRandomizedWords={setRandomizedWords}
          isCorrectOrder={isCorrectOrder}
          setIsCorrectOrder={setIsCorrectOrder}
          selectedWords={selectedWords}
          setSelectedWords={setSelectedWords}
          setSuccess={setSuccess}
        />
      ) : (
        <>
          <Typography.Body className="text-opacity-80 mt-4" variant="medium-light">
            Use the 12 words below to recover your account at a later date. Write down these words in the right order
            and store them in a safe place.{' '}
            <span className="text-white text-opacity-100 font-bold">
              Never share this recovery phrase with anyone as
            </span>{' '}
            this may result in the loss of your account.
          </Typography.Body>
          <div className="my-8">
            {/**<Typography.H2 className="mb-4">
              Write down Recovery Phrase
            </Typography.H2>*/}
            <div
              className={`${
                !showWords && 'blur-[10px]'
              } relative w-full p-12 bg-white bg-opacity-10 rounded-2xl justify-start items-start flex flex-col md:flex-row`}
            >
              <div className="w-full flex">
                <div className="grow-[0.6] shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                  {mnemonic
                    ?.split(' ')
                    .slice(0, 6)
                    .map((word, index) => (
                      <Typography.Body key={index} variant="medium-bold">
                        <span className="text-white text-opacity-50">{index + 1}. </span> {word}
                      </Typography.Body>
                    ))}
                </div>
                <div className="grow-[0.6] shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                  {mnemonic
                    ?.split(' ')
                    .slice(6, 12)
                    .map((word, index) => (
                      <Typography.Body key={index} variant="medium-bold">
                        <span className="text-white text-opacity-50">{index + 7}. </span> {word}
                      </Typography.Body>
                    ))}
                </div>
              </div>
              <div className="flex md:flex-col mt-4 gap-2 md:mt-0 md:gap-6">
                <div
                  onClick={handleDownloadRecoveryPhraseTXT}
                  className="w-auto flex gap-2 items-center cursor-pointer px-6 py-1.5 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-[64px] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.16)] backdrop-blur-[10px] justify-center items-center gap-1.5 inline-flex"
                >
                  <Icon.DownloadSimple size="16" />
                  <Typography.Body className="text-[13px]" variant="small-bold">
                    Download
                  </Typography.Body>
                </div>
                <div
                  onClick={handleCopyMnemonicToClipboard}
                  className="w-max flex gap-2 items-center cursor-pointer px-6 py-1.5 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-[64px] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.16)] backdrop-blur-[10px] justify-center items-center gap-1.5 inline-flex"
                >
                  {copyMnemonic ? <Icon.Check size="16" /> : <Icon.Clipboard size="16" />}
                  <Typography.Body
                    id="backup-copy-recovery-phrase"
                    className="text-[13px] flex gap-1"
                    variant="small-bold"
                  >
                    Copy <span className="hidden md:flex"> to clipboard</span>
                  </Typography.Body>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-[796px] justify-between items-center inline-flex gap-6">
            <Button.Large
              className="w-auto"
              variant="secondary"
              onClick={() => {
                setPhrase(false);
                setShowWords(false);
              }}
            >
              <span className="flex gap-2 items-center">
                <Icon.ArrowLeft />
                <span className="hidden sm:flex">Back</span>
              </span>
            </Button.Large>
            <Button.Large
              id="backup-reveal-confirm-recovery-phrase-btn"
              icon={showWords ? <Icon.ArrowRight /> : <Icon.Eye />}
              onClick={showWords ? () => setConfirmPhrase(true) : () => setShowWords(true)}
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
