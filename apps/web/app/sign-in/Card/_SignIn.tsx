import Image from 'next/image';

import { Content, Card, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePubkyClientContext } from '@/contexts';

export default function SignIn() {
  const { generateAuthUrl } = usePubkyClientContext();
  const [authUrl, setAuthUrl] = useState('');
  //const [showCopied, setShowCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    handleGenerateAuthUrl();
  }, []);

  const handleGenerateAuthUrl = async () => {
    const url = await generateAuthUrl();

    if (url) setAuthUrl(String(url));
  };

  {
    /**  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(authUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };
  */
  }

  return (
    <Card.Primary
      title="Sign in with"
      text="Scan the QR with Bitkit or any other Pubky Core powered wallet."
      imageTitle={
        <Link href="https://bitkit.to" target="_blank">
          <Image width={82} height={36} alt="bitkit" src="/images/bitkit.png" />
        </Link>
      }
      className="w-full col-span-2"
    >
      <div
        className="relative"
        //onClick={copyToClipboard}
      >
        {authUrl ? (
          <div className="blur-[3px] rounded-lg p-2 mt-2 bg-white flex justify-center-center">
            <QRCodeSVG
              value={authUrl}
              size={210}
              bgColor="#ffffff"
              fgColor="#000000"
              level="Q"
              ref={canvasRef}
            />
          </div>
        ) : (
          <Image
            width={320}
            height={320}
            className="rounded-lg mt-6"
            alt="qr"
            src="/images/qr.png"
          />
        )}
        <div className="w-full inset-0 flex items-center justify-right left-8 absolute">
          <Typography.H2
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)' }}
            className="text-[20px] mt-4 font-black text-center w-full px-4 py-2.5 bg-[#2a2a2f]"
          >
            COMING SOON
          </Typography.H2>
        </div>
      </div>
      <Content.LinksStoreApp />
    </Card.Primary>
  );
}
