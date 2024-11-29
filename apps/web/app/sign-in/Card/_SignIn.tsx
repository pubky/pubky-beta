'use client';

import Image from 'next/image';

import { Content, Card, Typography, Icon } from '@social/ui-shared';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  useAlertContext,
  usePubkyClientContext,
  useToastContext,
} from '@/contexts';
import { Utils } from '@social/utils-shared';

export default function SignIn() {
  const { generateAuthUrl, loginWithAuthUrl } = usePubkyClientContext();
  const { setContent: setContentToast, setShow: setShowToast } =
    useToastContext();
  const { setContent, setShow } = useAlertContext();
  const [loginError, setLoginError] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [qrSize, setQrSize] = useState(210);
  const canvasRef = useRef(null);

  useEffect(() => {
    handleGenerateAuthUrl();
  }, []);

  const handleGenerateAuthUrl = async () => {
    const result = generateAuthUrl();

    if (result && result.url) {
      setAuthUrl(result.url);

      try {
        const pubkey = await result.promise;
        if (pubkey) {
          const handleLoginResult = await loginWithAuthUrl(
            String(pubkey.z32()),
          );
          if (handleLoginResult) {
            setContent('Login successful!');
            setShow(true);
          }
        }
      } catch (error: unknown | { message: string }) {
        const errorMessage =
          (error as Error)?.message === 'aead::Error'
            ? 'Failed to login.'
            : (error as Error)?.message;
        setLoginError(errorMessage);
        console.error('Login error:', error);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(authUrl);
      setContentToast(Utils.minifyText(authUrl, 80));
      setShowToast(true);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth <= 640) {
        setQrSize(320);
      } else if (window.innerWidth <= 1024) {
        setQrSize(250);
      } else if (window.innerWidth <= 1280) {
        setQrSize(140);
      } else {
        setQrSize(210);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <Card.Primary
      title="Sign in with"
      text="Scan the QR with Bitkit or any other Pubky Core powered wallet."
      imageTitle={
        <Link href="https://bitkit.to" target="_blank">
          <Image
            width={88}
            height={26}
            alt="bitkit"
            src="/images/webp/bitkit.webp"
          />
        </Link>
      }
      className="w-full col-span-2"
    >
      <div className="relative" onClick={copyToClipboard}>
        {authUrl ? (
          <div className="rounded-lg mt-6 flex justify-center-center">
            <QRCodeSVG
              value={authUrl}
              size={qrSize}
              bgColor="#ffffff"
              fgColor="#000000"
              className="cursor-pointer bg-white p-2 rounded-lg"
              level="Q"
              ref={canvasRef}
            />
          </div>
        ) : (
          <Image
            width={320}
            height={320}
            className="blur-[3px] rounded-lg mt-6"
            alt="qr"
            src="/images/webp/qr.webp"
          />
        )}
        {/**<div className="w-full inset-0 flex items-center justify-right left-8 absolute">
          <Typography.H2
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)' }}
            className="text-[20px] mt-4 font-black text-center w-full px-4 py-2.5 bg-[#2a2a2f]"
          >
            COMING SOON
          </Typography.H2>
        </div>*/}
      </div>
      {loginError && (
        <div className="flex w-full justify-between items-center px-4 py-2 mt-6 mb-4 rounded-lg border-2 border-red-600 bg-[#e95164] bg-opacity-10">
          <Typography.Body
            className="break-words text-red-600"
            variant="small-bold"
          >
            {loginError}
          </Typography.Body>
          <div>
            <Icon.Warning color="#dc2626" />
          </div>
        </div>
      )}
      <Content.LinksStoreApp />
    </Card.Primary>
  );
}
