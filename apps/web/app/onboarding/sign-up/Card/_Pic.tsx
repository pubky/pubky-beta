import { ImageByUri } from '@/components/ImageByUri';
import { Button, Card, Icon } from '@social/ui-shared';

interface PicProps {
  image: File | string;
  setImage: React.Dispatch<React.SetStateAction<File | string>>;
}

export default function Pic({ image, setImage }: PicProps) {
  const handleUploadImage = () => {
    if (image === '/images/Userpic.png') {
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.click();
      }
    } else {
      setImage('/images/Userpic.png');
      //const idImage = Utils.encodeImageId(image);
      //if (idImage) deleteFile(idImage);
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
      <div>
        <Icon.File size="16" />
      </div>
    ) : (
      <div>
        <Icon.Trash size="16" />
      </div>
    );
  };

  const getButtonLabelImage = () => {
    return image === '/images/Userpic.png' ? 'Choose file' : undefined;
  };

  const getButtonWidthImage = () => {
    return image === '/images/Userpic.png' ? 'w-[154px]' : 'w-[38px] h-[38px]';
  };

  return (
    <Card.Primary className="justify-start z-10" title="Picture">
      {image && (
        <div className="relative">
          <ImageByUri
            width={150}
            height={150}
            className="w-80 h-80 mt-12 rounded-full"
            alt="user"
            uri={image}
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
