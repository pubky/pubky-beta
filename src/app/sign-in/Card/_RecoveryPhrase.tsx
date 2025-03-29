'use client';

import { usePubkyClientContext } from '@/contexts';
import { Card, Input, Button, Icon, Typography } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RecoveryPhrase() {
  const { loginWithMnemonic } = usePubkyClientContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [words, setWords] = useState(Array(12).fill(''));
  const [missingWordsError, setMissingWordsError] = useState('');

  const handleWordChange = (index, value) => {
    const sanitizedValue = value.replace(/[^a-zA-Z]/g, '').toLowerCase();

    const newWords = [...words];
    newWords[index] = sanitizedValue;
    setWords(newWords);

    if (missingWordsError) {
      setMissingWordsError('');
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedText = event.clipboardData.getData('Text').trim();
    const pastedWords = pastedText.split(/\s+/).slice(0, 12);

    setWords(() => pastedWords.concat(Array(12 - pastedWords.length).fill('')));
    setMissingWordsError('');
  };

  const handleSubmit = async () => {
    if (loading) return;

    const missingIndexes = words
      .map((word, index) => (word.trim() === '' ? index + 1 : null))
      .filter((index) => index !== null);

    if (missingIndexes.length > 0) {
      const missingWordText = missingIndexes.length === 1 ? 'Word' : 'Words';
      setMissingWordsError(`${missingWordText} ${missingIndexes.join(', ')} missing`);
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      const mnemonic = words.join(' ').trim();
      const response = await loginWithMnemonic(mnemonic);
      if (response) router.push('/home');
    } catch (error: unknown | { message: string }) {
      const errorMessage =
        (error as Error)?.message === 'aead::Error' ? 'Recovery phrase is incorrect.' : (error as Error)?.message;
      setLoginError(errorMessage);
      setLoading(false);
      console.error('Login error:', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Card.Primary
      title="Recovery Phrase"
      text="Enter your recovery phrase from a backup."
      className="w-full col-span-3"
    >
      <div className="my-6 grid grid-rows-6 grid-flow-col gap-1">
        {Array.from({ length: 12 }, (_, index) => (
          <Input.Word
            id={`recovery-phrase-input-${index}`}
            key={index}
            placeholder={`${index + 1}.`}
            value={words[index]}
            onChange={(e) => handleWordChange(index, e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="lowercase"
          />
        ))}
      </div>
      {missingWordsError && (
        <div className="flex w-full justify-between items-center px-4 py-2 mb-4 rounded-lg border-2 border-yellow-500 bg-yellow-600 bg-opacity-10">
          <Typography.Body className="break-words text-yellow-500" variant="small-bold">
            {missingWordsError}
          </Typography.Body>
          <div>
            <Icon.Warning color="#EAB308" />
          </div>
        </div>
      )}
      {loginError && (
        <div className="flex w-full justify-between items-center px-4 py-2 mb-4 rounded-lg border-2 border-red-600 bg-[#e95164] bg-opacity-10">
          <Typography.Body className="break-words text-red-600" variant="small-bold">
            {loginError}
          </Typography.Body>
          <div>
            <Icon.Warning color="#dc2626" />
          </div>
        </div>
      )}
      <Button.Large
        onClick={!loading ? () => handleSubmit() : undefined}
        loading={loading}
        className="mt-4 lg:mt-0"
        icon={<Icon.Key size="16" />}
        id="sign-in-recovery-phrase-btn"
        variant="secondary"
      >
        Sign in
      </Button.Large>
    </Card.Primary>
  );
}
