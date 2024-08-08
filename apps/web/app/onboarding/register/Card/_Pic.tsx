import { useClientContext } from '@/contexts';
import { Button, Card, Icon, Input } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Image from 'next/image';

interface PicProps {
  image: File | string;
  setImage: React.Dispatch<React.SetStateAction<File | string>>;
}

export default function Pic({ image, setImage }: PicProps) {
  const { deleteFile } = useClientContext();

  const handleUploadImage = () => {
    if (image === '/images/Userpic.png') {
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.click();
      }
    } else {
      setImage('/images/Userpic.png');
      const idImage = Utils.encodeImageId(image);
      if (idImage) deleteFile(idImage);
    }
  };

  const UploadPic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const getButtonIconImage = () => {
    return image === '/images/Userpic.png' ? (
      <Icon.File size="16" />
    ) : (
      <Icon.Trash size="16" />
    );
  };

  const getButtonLabelImage = () => {
    return image === '/images/Userpic.png' ? 'Choose file' : undefined;
  };

  const getButtonWidthImage = () => {
    return image === '/images/Userpic.png' ? 'w-[154px]' : 'w-[60px]';
  };

  return (
    <Card.Primary className="justify-start z-10" title="Picture">
      {image && (
        <div className="relative">
          <Image
            width={150}
            height={150}
            className="w-80 h-80 mt-12 rounded-full"
            alt="user"
            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
          />
          <Button.Transparent
            icon={getButtonIconImage()}
            onClick={handleUploadImage}
            className={`${getButtonWidthImage()} mt-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
          >
            {getButtonLabelImage()}
          </Button.Transparent>
        </div>
      )}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={UploadPic}
        className="hidden"
      />
    </Card.Primary>
  );
}
