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
      <Typography.Body className="text-opacity-80 mt-4" variant="medium-light">
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
      <div className="flex w-full gap-2 items-center px-4 py-3 mb-4 rounded-2xl border-2 border-[#ffd200] bg-yellow-600 bg-opacity-10">
        <div>
          <Icon.Warning color="#ffd200" size="20" />
        </div>
        <Typography.Body
          className="break-words text-[#ffd200] leading-6"
          variant="medium-bold"
        >
          After confirmation, your recovery phrase will be deleted (!)
        </Typography.Body>
      </div>
      <div className="w-full max-w-[796px] mt-2 justify-between items-center inline-flex gap-6">
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
