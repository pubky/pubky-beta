import { ImageByUri } from '@/components/ImageByUri';
import { Utils } from '@/components/utils-shared';
import { useAlertContext, useModal, usePubkyClientContext } from '@/contexts';
import { Button, Card, Icon } from '@social/ui-shared';
import { useEffect, useState } from 'react';

interface PicProps {
  image: File | string | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | string | undefined>>;
  loading: boolean;
}

export default function Pic({ image, setImage, loading }: PicProps) {
  const { pubky } = usePubkyClientContext();
  const { addAlert, removeAlert } = useAlertContext();
  const { openModal } = useModal();
  const [idImage, setIdImage] = useState('');

  useEffect(() => {
    setIdImage(pubky || [...Array(52)].map(() => Math.random().toString(36).charAt(2)).join(''));
  }, [pubky]);

  const handleUploadImage = () => {
    if (!image) {
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.click();
      }
    } else {
      setImage(undefined);
    }
  };

  const UploadPic = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > maxSizeInBytes) {
        try {
          const loadingAlertId = addAlert('Compressing image...', 'loading');
          const resizedFile = await Utils.resizeImageFile(file, maxSizeInBytes);
          removeAlert(loadingAlertId);

          const img = new Image();
          const newImageUrl = URL.createObjectURL(resizedFile);
          img.src = newImageUrl;

          img.onload = () => {
            openModal('croppedImage', { image: newImageUrl, setImage });
          };
        } catch (error) {
          addAlert('The maximum allowed size is 5 MB', 'warning');
        }
      } else {
        const img = new Image();
        const newImageUrl = URL.createObjectURL(file);
        img.src = newImageUrl;

        img.onload = () => {
          openModal('croppedImage', { image: newImageUrl, setImage });
        };
      }
      event.target.value = '';
    }
  };

  const getButtonIconImage = () => {
    return !image ? (
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
    return !image ? 'Choose file' : undefined;
  };

  const getButtonWidthImage = () => {
    return !image ? 'w-[120px] lg:w-[85%] xl:w-8/12' : 'w-[38px] h-[38px]';
  };

  return (
    <Card.Primary className="justify-start z-10 w-full col-span-2" title="Picture">
      <div className="relative flex items-center justify-center">
        <ImageByUri
          id={idImage}
          width={100}
          height={100}
          className="w-72 h-72 lg:w-36 lg:h-36 xl:w-52 xl:h-52 mt-[20px] lg:mt-[50px] rounded-full"
          alt="user"
          uri={image || idImage}
        />
        <Button.Transparent
          icon={getButtonIconImage()}
          onClick={handleUploadImage}
          className={`${getButtonWidthImage()} mt-2 md:mt-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
        >
          {getButtonLabelImage()}
        </Button.Transparent>
      </div>
      <input id="fileInput" type="file" accept="image/*" onChange={UploadPic} className="hidden" disabled={loading} />
    </Card.Primary>
  );
}
