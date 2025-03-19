'use client';

import Image from 'next/image';

import { Content, Card, Typography, Icon, Button } from '@social/ui-shared';
import Link from 'next/link';
import { useAlertContext, usePubkyClientContext, useToastContext } from '@/contexts';
import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function Join() {
  const { generateAuthUrl, loginWithAuthUrl } = usePubkyClientContext();
  const isMobile = useIsMobile(640);
  const router = useRouter();
  const { addToast } = useToastContext();
  const { addAlert } = useAlertContext();
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const fallbackUrl = isIOS ? 'https://apps.apple.com/app' : 'https://play.google.com/store/apps';
  const [loginError, setLoginError] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [appLink, setAppLink] = useState('');
  const [qrSize, setQrSize] = useState(210);
  const canvasRef = useRef(null);

  useEffect(() => {
    setAppLink(`pubkyring://${authUrl}`);
  }, [authUrl]);

  const openApp = () => {
    const newTab = window.open(appLink, '_blank');
    setTimeout(() => {
      if (newTab) newTab.location.href = fallbackUrl;
    }, 2000);
  };

  useEffect(() => {
    const abortController = new AbortController();
    handleGenerateAuthUrl(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  const handleGenerateAuthUrl = async (signal: AbortSignal) => {
    if (signal.aborted) return;

    setLoginError('');
    const result = await generateAuthUrl();

    if (result && result.url) {
      setAuthUrl(result.url);

      try {
        const pubkey = await result.promise;
        if (pubkey) {
          const handleLoginResult = await loginWithAuthUrl(String(pubkey.z32()));
          if (handleLoginResult) {
            addAlert('Login successful!');
            router.push('/home');
          }
        }
      } catch (error: unknown | { message: string }) {
        try {
          const errorMessage = error === 'aead::Error' ? 'Failed to login.' : null;

          if (errorMessage) {
            setLoginError(errorMessage);
          }
          handleGenerateAuthUrl(signal);
        } catch (error) {
          console.error('Unexpected error occurred:', error);
        }
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(authUrl);
      addToast(Utils.minifyText(authUrl, 80));
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth <= 640) {
        setQrSize(320);
      } else if (window.innerWidth <= 1023) {
        setQrSize(250);
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
      title={isMobile ? 'Join with' : 'Use'}
      text={`${isMobile ? 'Use' : 'Scan the QR with'} Pubky Ring or any other Pubky Core powered wallet.`}
      imageTitle={
        <Link className="ml-2" href="https://github.com/pubky" target="_blank">
          <Image width={142} height={30} alt="bitkit" src="/images/webp/pubky-ring.webp" />
        </Link>
      }
      className="w-full col-span-2"
    >
      {!isMobile && (
        <div className="relative cursor-pointer" onClick={copyToClipboard}>
          {authUrl && !loginError ? (
            <div className="relative w-fit mt-6">
              <QRCodeSVG
                value={authUrl}
                size={qrSize}
                bgColor="#ffffff"
                fgColor="#000000"
                level="Q"
                className="bg-white p-2 rounded-lg"
                ref={canvasRef}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[41.63px] h-[41.63px] bg-black rounded-[50px] flex items-center justify-center">
                  <img className="w-[15.72px] h-6" src="/images/webp/pubky-ring-mark.svg" alt="Logo" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <Image
                width={320}
                height={320}
                className="blur-[3px] rounded-lg mt-6"
                alt="qr"
                src="/images/webp/qr.webp"
              />
              <div className="w-full inset-0 flex items-center justify-right left-8 absolute">
                <Typography.H2
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)'
                  }}
                  className="text-[20px] mt-4 font-black text-center w-full px-4 py-2.5 bg-[#2a2a2f]"
                >
                  Not Available
                </Typography.H2>
              </div>
            </>
          )}
        </div>
      )}
      {loginError && (
        <div className="flex w-full justify-between items-center px-4 py-2 mt-6 mb-4 rounded-lg border-2 border-red-600 bg-[#e95164] bg-opacity-10">
          <Typography.Body className="break-words text-red-600" variant="small-bold">
            {Utils.minifyText(loginError, 50)}
          </Typography.Body>
          <div>
            <Icon.Warning color="#dc2626" />
          </div>
        </div>
      )}
      <Content.LinksStoreApp />
      {isMobile && (
        <Button.Medium
          onClick={() => {
            copyToClipboard();
            openApp();
          }}
          icon={<Icon.Key size="16" />}
          className="mt-2"
        >
          Authorize with Pubky Ring
        </Button.Medium>
      )}
    </Card.Primary>
  );
}
