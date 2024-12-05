/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';

interface FilePreviewProps {
  file: File;
  filePreview: string;
  index: number;
  removeFile: (index: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  filePreview,
  index,
  removeFile,
}) => {
  const isVideo = file.type.startsWith('video');
  const isImage = file.type.startsWith('image');
  const isPDF = file.type === 'application/pdf';
  const isAudio = file.type.startsWith('audio');

  return (
    <div className="relative">
      <div
        onClick={() => removeFile(index)}
        className="z-10 cursor-pointer absolute top-2.5 right-2.5 w-10 h-10 p-3 bg-[#05050a] bg-opacity-50 hover:bg-opacity-30 rounded-[48px] backdrop-blur-[20px] justify-center items-center inline-flex"
      >
        <Icon.Trash size="20" />
      </div>
      {isVideo ? (
        <video
          src={filePreview}
          controls
          className="max-w-full max-h-[216px] min-w-[200px] rounded-lg"
        />
      ) : isImage ? (
        <img
          src={filePreview}
          alt={`Selected file ${index + 1}`}
          className="max-w-full max-h-[216px] min-w-[200px] rounded-lg"
        />
      ) : isPDF ? (
        <div className="flex flex-col justify-center items-center h-[216px] min-w-[200px] bg-gray-100 rounded-lg p-4">
          <Icon.FileText size="64" color="#05050a" />
          <p className="mt-2 text-gray-700 text-sm text-center break-all">
            {Utils.minifyText(file.name, 50)}
          </p>
        </div>
      ) : isAudio ? (
        <div className="flex flex-col justify-center items-center h-[216px] min-w-[200px] bg-gray-100 rounded-lg p-4">
          <Icon.SpeakerHigh size="64" color="#05050a" />
          <p className="mt-2 text-gray-700 text-sm text-center">
            {Utils.minifyText(file.name, 50)}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Unsupported file type</p>
      )}
    </div>
  );
};

export default FilePreview;
