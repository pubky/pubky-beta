'use client';

import { usePubkyClientContext } from '@/contexts';
import { Button, Icon, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useEffect, useState } from 'react';

interface ConfirmPhraseProps {
  setShowModalBackup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBackupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmPhrase: React.Dispatch<React.SetStateAction<boolean>>;
  randomizedWords: string[];
  setRandomizedWords: React.Dispatch<React.SetStateAction<string[]>>;
  isCorrectOrder: boolean;
  setIsCorrectOrder: React.Dispatch<React.SetStateAction<boolean>>;
  selectedWords: string[];
  setSelectedWords: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ConfirmPhrase({
  setShowModalBackup,
  setShowBackupSuccess,
  setConfirmPhrase,
  randomizedWords,
  setRandomizedWords,
  isCorrectOrder,
  setIsCorrectOrder,
  selectedWords,
  setSelectedWords,
}: ConfirmPhraseProps) {
  const { setSeed, setMnemonic, mnemonic } = usePubkyClientContext();
  const [copyMnemonic, setCopyMnemonic] = useState(false);
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

  const handleSelectWord = (word: string) => {
    // if (selectedWords.includes(word)) return;

    const firstEmptyOrIncorrectIndex = selectedWords.findIndex(
      (selectedWord, idx) => !selectedWord || selectedWord !== correctOrder[idx]
    );

    if (firstEmptyOrIncorrectIndex !== -1) {
      const newSelectedWords = [...selectedWords];
      newSelectedWords[firstEmptyOrIncorrectIndex] = word;
      setSelectedWords(newSelectedWords);
    }
  };

  const handleRecoveryPhrase = () => {
    setSeed(undefined);
    setMnemonic(undefined);
    Utils.storage.remove('mnemonic');
    Utils.storage.remove('seed');
    setShowModalBackup(false);
    setShowBackupSuccess && setShowBackupSuccess(true);
  };

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
      <Typography.Body className="text-opacity-80 mt-2" variant="medium-light">
        Tap the 12 words in the correct order.
      </Typography.Body>
      <div className="my-4">
        <div className="flex-wrap mb-4 flex gap-2">
          {randomizedWords.map((word, index) => (
            <Typography.Body
              key={index}
              onClick={() => handleSelectWord(word)}
              className={`py-2 px-4 rounded-full cursor-pointer ${
                selectedWords.includes(word)
                  ? 'bg-white bg-opacity-20'
                  : 'bg-white bg-opacity-10'
              }`}
              variant="small-bold"
            >
              {word}
            </Typography.Body>
          ))}
        </div>
        <div className="relative w-full p-12 bg-white bg-opacity-10 rounded-2xl justify-start items-start gap-12 inline-flex">
          <div className="flex-grow flex-col justify-start items-start gap-2 flex">
            {selectedWords.slice(0, 6).map((word, index) => (
              <Typography.Body key={index} variant="medium-bold">
                <span className="text-white text-opacity-50">
                  {index + 1}.{' '}
                </span>
                <span
                  className={
                    word
                      ? correctOrder[index] === word
                        ? 'text-green-500'
                        : 'text-red-500'
                      : 'text-white text-opacity-50'
                  }
                >
                  {word || ''}
                </span>
              </Typography.Body>
            ))}
          </div>
          <div className="flex-grow flex-col justify-start items-start gap-2 flex">
            {selectedWords.slice(6, 12).map((word, index) => (
              <Typography.Body key={index + 6} variant="medium-bold">
                <span className="text-white text-opacity-50">
                  {index + 7}.{' '}
                </span>
                <span
                  className={
                    word
                      ? correctOrder[index + 6] === word
                        ? 'text-green-500'
                        : 'text-red-500'
                      : 'text-white text-opacity-50'
                  }
                >
                  {word || ''}
                </span>
              </Typography.Body>
            ))}
          </div>
          {isCorrectOrder && (
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
                <Typography.Body variant="small-bold">Download</Typography.Body>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        {isCorrectOrder && (
          <div className="flex w-full justify-between items-center px-4 py-2 mb-4 rounded-lg border-2 border-yellow-500 bg-yellow-600 bg-opacity-10">
            <Typography.Body
              className="break-words text-yellow-500"
              variant="small-bold"
            >
              After confirmation, your recovery phrase will be deleted. No way
              to recover or revise it later.
            </Typography.Body>
            <div>
              <Icon.Warning color="#EAB308" />
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-[796px] mt-4 justify-between items-center inline-flex">
        <Button.Large
          icon={<Icon.ArrowLeft />}
          className="w-auto"
          variant="secondary"
          onClick={() => {
            setConfirmPhrase(false);
            setSelectedWords(Array(12).fill(''));
          }}
        >
          Back
        </Button.Large>
        <Button.Large
          icon={<Icon.Check color={isCorrectOrder ? 'white' : 'gray'} />}
          disabled={!isCorrectOrder}
          onClick={() => (isCorrectOrder ? handleRecoveryPhrase() : undefined)}
          className="w-auto"
        >
          Done
        </Button.Large>
      </div>
    </>
  );
}
