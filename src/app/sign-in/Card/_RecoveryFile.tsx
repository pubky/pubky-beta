import { Button, Card, Icon, Input, Typography } from '@social/ui-shared';

interface Errors {
  password: string;
  recoveryFile: string;
}

interface RecoveryFileProps {
  errors: Errors;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  loginError: string;
  // userNotFound: boolean;
  loading: boolean;
  handleSubmit: () => void;
  setRecoveryFile: React.Dispatch<React.SetStateAction<Buffer | null>>;
}

export default function RecoveryFile({
  errors,
  fileName,
  setFileName,
  setPassword,
  loginError,
  // userNotFound,
  loading,
  handleSubmit,
  setRecoveryFile,
}: RecoveryFileProps) {
  const UploadRecoveryFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRecoveryFile(Buffer.from(reader.result as ArrayBuffer));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Card.Primary
      title="Recovery File"
      text="Upload your recovery file, enter your password."
      className="w-full col-span-3"
    >
      <div className="flex-col inline-flex gap-4">
        <div>
          <Input.Label value="Recovery file" />
          <Input.UploadFile
            required
            error={errors.recoveryFile}
            fileName={fileName}
            className="mt-1"
            id="file_input"
            onChange={UploadRecoveryFile}
            accept=".pkarr"
            disabled={loading}
          />
        </div>
        <div>
          <Input.Label value="Password" />
          <Input.Text
            className="h-[70px] mt-1"
            type="password"
            error={errors.password}
            disabled={loading}
            placeholder="••••••••••••"
            id="sign-in-password-input"
            onKeyDown={handleKeyDown}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>
      </div>
      {loginError && (
        <div className="flex w-full justify-between items-center px-4 py-2 mt-6 mb-4 rounded-lg border-2 border-red-600 bg-[#e95164] bg-opacity-10">
          <Typography.Body
            className="break-words text-red-600"
            variant="small-bold"
          >
            {loginError === 'Invalid encryption key' ||
            loginError === 'Invalid recovery file'
              ? 'Recovery password or recovery file incorrect'
              : loginError}
          </Typography.Body>
          <div>
            <Icon.Warning color="#dc2626" />
          </div>
        </div>
      )}
      {/**userNotFound && (
        <div className="flex justify-center items-center px-4 py-2 mt-6 mb-4 rounded-lg border-2 border-white bg-white bg-opacity-10">
          <Typography.Body className="text-white" variant="small-bold">
            Your profile was not found, please{' '}
            <span
              onClick={() => router.push('/onboarding/sign-in')}
              className="text-white text-opacity-90 hover:text-opacity-100 cursor-pointer"
            >
              create a new one
            </span>
          </Typography.Body>
          <Icon.Warning color="white" />
        </div>
      )*/}
      <Button.Large
        onClick={!loading ? () => handleSubmit() : undefined}
        icon={<Icon.Key size="16" />}
        loading={loading}
        className="mt-4"
        id="sign-in-recovery-file-btn"
        variant="secondary"
      >
        Sign in
      </Button.Large>
    </Card.Primary>
  );
}
