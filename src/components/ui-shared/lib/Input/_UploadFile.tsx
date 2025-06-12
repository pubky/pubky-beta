import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

interface UploadFileProps extends React.HTMLAttributes<HTMLInputElement> {
  error?: string;
  required?: boolean;
  fileName?: string;
  accept?: string;
  disabled?: boolean;
}

export const UploadFile = ({ error, required = false, fileName, accept, disabled, ...rest }: UploadFileProps) => {
  const baseCSS = `w-full h-[70px] p-6 rounded-2xl border border-white border-opacity-30 border-dashed flex justify-between items-center`;

  const errorCSS = `text-red-600 text-sm mt-2`;

  return (
    <div className="relative w-full">
      <div {...rest} className={twMerge(baseCSS, rest.className, error ? 'border-red-600 border-opacity-100' : '')}>
        <Typography.Body className="text-opacity-30" variant="medium">
          {fileName && fileName.length > 16 ? fileName.substring(0, 16) + '...' : fileName}
        </Typography.Body>
        <div
          className="cursor-pointer flex gap-2 rounded-full py-2 px-3 bg-white bg-opacity-10 hover:bg-opacity-20 ml-auto"
          onClick={() => {
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
              fileInput.click();
            }
          }}
        >
          <div className="hidden sm:block">
            <Icon.File size="16" />
          </div>
          <Typography.Label id="import-select-file" className="flex gap-1 cursor-pointer normal-case">
            Select file
          </Typography.Label>
        </div>
      </div>
      <input
        {...rest}
        type="file"
        required={required}
        disabled={disabled}
        id="fileInput"
        className="hidden"
        accept={accept}
      />
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
