import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

interface UploadFileProps extends React.HTMLAttributes<HTMLInputElement> {
  error?: string;
  required?: boolean;
  fileName?: string;
}

export const UploadFile = ({
  error,
  required = false,
  fileName,
  ...rest
}: UploadFileProps) => {
  const baseCSS = `w-full p-5 bg-white bg-opacity-10 rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.32)_inset] 
  border border-white border-opacity-10 flex justify-between items-center`;

  const errorCSS = `text-red-500 text-sm mt-2`;

  return (
    <div className="relative w-full">
      <div
        {...rest}
        className={twMerge(
          baseCSS,
          rest.className,
          error ? 'border-red-500 border-opacity-100' : ''
        )}
      >
        <Typography.Body className="text-opacity-30" variant="medium">
          {fileName && fileName.length > 16
            ? fileName.substring(0, 16) + '...'
            : fileName}
        </Typography.Body>
        <div
          className="cursor-pointer flex gap-2 rounded-full py-2 px-4 bg-white bg-opacity-10 hover:bg-opacity-20 ml-auto"
          onClick={() => {
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
              fileInput.click();
            }
          }}
        >
          <Icon.File size="16" />
          <Typography.Label className="cursor-pointer normal-case">
            Select file
          </Typography.Label>
        </div>
      </div>
      <input
        {...rest}
        type="file"
        required={required}
        id="fileInput"
        className="hidden"
      />
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
