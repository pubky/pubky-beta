/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Icon } from '@social/ui-shared';

interface FilePreviewProps {
  file: File;
  index: number;
  removeFile: (index: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  index,
  removeFile,
}) => {
  return (
    <div className="relative">
      <div
        onClick={() => removeFile(index)}
        className="cursor-pointer absolute top-2.5 right-2.5 w-10 h-10 p-3 bg-[#05050a] bg-opacity-50 hover:bg-opacity-30 rounded-[48px] backdrop-blur-[20px] justify-center items-center inline-flex"
      >
        <Icon.Trash size="20" />
      </div>
      <img
        src={URL.createObjectURL(file)}
        alt={`Selected file ${index + 1}`}
        className="max-w-full max-h-[216px] rounded-lg"
      />
    </div>
  );
};

export default FilePreview;
