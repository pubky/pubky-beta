'use client';

import { Button, Icon, Input, Typography } from '@social/ui-shared';
import { useState } from 'react';

interface FileProps {
  loading: boolean;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => Promise<void>;
  errors: string;
  setFile: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function File({ loading, password, setPassword, handleSubmit, errors, setFile }: FileProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Typography.Body className="text-opacity-80 mt-4" variant="medium-light">
        Encrypt your recovery file below with a secure password, download it, and save it to your computer or your cloud
        provider. Never share this file and password with anyone.
      </Typography.Body>
      <div className="my-4">
        <Typography.H2 className="mb-4">Recovery File Password</Typography.H2>
        <Input.Label className="mt-4" value="Password" />
        <Input.Text
          id="backup-recovery-file-password-input"
          className="h-[70px] mt-1"
          type={showPassword ? 'text' : 'password'}
          error={errors}
          placeholder="••••••••••••"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          action={
            password && (
              <div
                className="mt-1.5 mr-2 flex cursor-pointer p-2 hover:bg-white/10 rounded-full"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <Icon.Eye size="20" /> : <Icon.EyeSlash size="20" />}
              </div>
            )
          }
        />
      </div>
      <div className="flex w-full gap-2 items-center px-4 py-3 mb-4 rounded-2xl border-2 border-[#ffd200] bg-yellow-600 bg-opacity-10">
        <div>
          <Icon.Warning color="#ffd200" size="20" />
        </div>
        <Typography.Body className="break-words text-[#ffd200] leading-6" variant="medium-bold">
          After confirmation, your recovery phrase will be deleted (!)
        </Typography.Body>
      </div>
      <div className="w-full max-w-[796px] mt-2 justify-between items-center inline-flex gap-6">
        <Button.Large className="w-auto" variant="secondary" onClick={() => setFile(false)}>
          <span className="flex gap-2 items-center">
            <Icon.ArrowLeft />
            <span className="hidden sm:flex">Back</span>
          </span>
        </Button.Large>
        <Button.Large
          id="backup-download-recovery-file-btn"
          icon={<Icon.DownloadSimple />}
          onClick={() => {
            if (!loading) handleSubmit();
          }}
          loading={loading}
          className="w-auto"
        >
          Download Recovery File
        </Button.Large>
      </div>
    </>
  );
}
