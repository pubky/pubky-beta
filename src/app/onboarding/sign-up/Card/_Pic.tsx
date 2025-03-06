import { ImageByUri } from '@/components/ImageByUri';
import { useModal } from '@/hooks/useModal';
import { useAlert } from '@/hooks/useAlert';
import { Button, Card, Icon } from '@social/ui-shared';

interface PicProps {
  image: File | string | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | string | undefined>>;
  loading: boolean;
  defaultImage: File | undefined;
}

export default function Pic({ image, setImage, loading, defaultImage }: PicProps) {
  const { addAlert } = useAlert();
  const { openModal } = useModal();

  const handleUploadImage = () => {
    if (image === defaultImage) {
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.click();
      }
    } else {
      defaultImage && setImage(defaultImage);
    }
  };

  const UploadPic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxSizeInMB = 20;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > maxSizeInBytes) {
        addAlert('The maximum allowed size is 20 MB', 'warning');
        return;
      }

      const img = new Image();
      const newImageUrl = URL.createObjectURL(file);
      img.src = newImageUrl;

      img.onload = () => {
        openModal('croppedImage', { image: newImageUrl, setImage });
      };
      event.target.value = '';
    }
  };

  const getButtonIconImage = () => {
    return image === defaultImage ? (
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
    return image === defaultImage ? 'Choose file' : undefined;
  };

  const getButtonWidthImage = () => {
    return image === defaultImage ? 'w-[120px] lg:w-[85%] xl:w-8/12' : 'w-[38px] h-[38px]';
  };

  return (
    <Card.Primary className="justify-start z-10 w-full col-span-2" title="Picture">
      {image && (
        <div className="relative flex items-center justify-center">
          <ImageByUri
            width={100}
            height={100}
            className="w-72 h-72 lg:w-36 lg:h-36 xl:w-52 xl:h-52 mt-[20px] lg:mt-[50px] rounded-full"
            alt="user"
            uri={image}
          />
          <Button.Transparent
            icon={getButtonIconImage()}
            onClick={handleUploadImage}
            className={`${getButtonWidthImage()} mt-2 md:mt-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
          >
            {getButtonLabelImage()}
          </Button.Transparent>
        </div>
      )}
      <input id="fileInput" type="file" accept="image/*" onChange={UploadPic} className="hidden" disabled={loading} />
    </Card.Primary>
  );
}
