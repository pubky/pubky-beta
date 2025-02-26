import { useEffect, useState } from 'react';
import { Button, Icon, Typography } from '@social/ui-shared';
import Image from 'next/image';

interface SuccessProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Success({ setShow }: SuccessProps) {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft <= 0) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, setShow]);

  return (
    <>
      <Typography.Body className="text-opacity-80 mt-4" variant="medium-light">
        Backup successful! Your recovery file and recovery phrase have been deleted. Going forward, you can sign back in
        using your chosen recovery method.
      </Typography.Body>
      <div className="relative my-4 w-full bg-white bg-opacity-10 rounded-2xl flex-col justify-center items-center inline-flex">
        <div className="p-12 flex-col justify-center items-center flex">
          <div className="p-7">
            <Icon.CheckCircle size="130" color="#C8FF00" />
            <Image alt="glow" fill src="/images/webp/glow-2.webp" />
          </div>
        </div>
      </div>
      <div className="w-full justify-end items-right inline-flex gap-6">
        <Button.Large
          id="backup-successful-ok-btn"
          icon={<Icon.Check />}
          className="w-auto"
          onClick={() => setShow(false)}
        >
          Ok ({timeLeft}s)
        </Button.Large>
      </div>
    </>
  );
}
