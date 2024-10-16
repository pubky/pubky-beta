import { ImageByUri } from '@/components/ImageByUri';
import { useAlertContext } from '@/contexts';
import { Button, Card, Icon } from '@social/ui-shared';

interface PicProps {
  image: File | string;
  setImage: React.Dispatch<React.SetStateAction<File | string>>;
  loading: boolean;
}

export default function Pic({ image, setImage, loading }: PicProps) {
  const { setContent, setShow } = useAlertContext();

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
    const maxSizeInMB = 20;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > maxSizeInBytes) {
        setContent('The maximum allowed size is 20 MB', 'warning');
        setShow(true);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            size,
            size
          );

          canvas.toBlob((blob) => {
            if (blob) {
              const croppedFile = new File([blob], file.name, {
                type: file.type,
              });
              setImage(croppedFile);
            }
          }, file.type);
        }
      };
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
    return image === '/images/Userpic.png' ? 'w-auto' : 'w-[38px] h-[38px]';
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
        disabled={loading}
      />
    </Card.Primary>
  );
}
