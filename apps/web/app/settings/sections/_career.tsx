import { Icon, Input, Typography } from '@social/ui-shared';
import { useState } from 'react';

export default function Career() {
  const [fileName, setFileName] = useState('Add your CV');
  const [CVFile, setCVFile] = useState<File>();

  const UploadCVFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }

    const file = event.target.files?.[0];
    if (file) {
      setCVFile(file);
    }
  };
  return (
    <div className="w-full p-12 bg-white bg-opacity-10 rounded-2xl flex-col justify-start items-start gap-12 inline-flex">
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="w-full justify-start items-center gap-2 inline-flex">
          <Icon.CV size="24" />
          <Typography.H2>Career</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Add your CV and past experiences to get noticed
        </Typography.Body>
        <div className='w-full flex justify-between gap-4'>
        <div className="w-full">
          <Input.Label value="Add CV" />
          <Input.UploadFile
            required
            //error={errors.recoveryFile}
            fileName={fileName}
            className="mt-1"
            id="file_input"
            onChange={UploadCVFile}
          />
        </div>
        <div className='w-full'>
        <Input.Label value="Add an email" />
        <Input.Text
          placeholder={"Add email"}
           className="mt-1"
          //value={link.url}
          //error={errors[`link${index}` as keyof typeof errors]}
        />
        </div>
        </div>
      </div>
    </div>
  );
}
