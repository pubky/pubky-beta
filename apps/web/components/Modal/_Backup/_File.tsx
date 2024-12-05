import { Button, Icon, Input, Typography } from '@social/ui-shared';

interface FileProps {
  loading: boolean;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => Promise<void>;
  errors: string;
  setFile: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function File({
  loading,
  setPassword,
  handleSubmit,
  errors,
  setFile,
}: FileProps) {
  return (
    <>
      <Typography.Body className="text-opacity-80 mt-2" variant="medium-light">
        Encrypt your recovery file below with a secure password, download it,
        and save it to your computer or your cloud provider. Never share this
        file and password with anyone.
      </Typography.Body>
      <div className="my-4">
        <Typography.H2 className="mb-4">Recovery File Password</Typography.H2>
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
      <div className="w-full max-w-[796px] mt-4 justify-between items-center inline-flex gap-6">
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
  );
}
