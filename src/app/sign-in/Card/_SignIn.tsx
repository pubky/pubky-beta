'use client';

import Image from 'next/image';

import { Content, Card, Typography, Icon, Button } from '@social/ui-shared';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAlertContext, usePubkyClientContext, useToastContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function SignIn() {
  const { generateAuthUrl, loginWithAuthUrl, isOnline } = usePubkyClientContext();
  const isMobile = useIsMobile(640);
  const router = useRouter();
  const { addToast } = useToastContext();
  const { addAlert } = useAlertContext();
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const fallbackUrl = isIOS ? 'https://apps.apple.com/app' : 'https://play.google.com/store/apps';
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
  const isiOSPWA = isIOS && isStandalone;
  const [loginError, setLoginError] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [appLink, setAppLink] = useState('');
  const [qrSize, setQrSize] = useState(210);
  const retryCountRef = useRef(0);
  const canvasRef = useRef(null);
  const errorRetryMessage = 'Retry attempts reached. Click here to reload the page.';

  useEffect(() => {
    if (!isOnline) {
      setLoginError('Error sending request. Check internet connection.');
      setAuthUrl('');
    } else {
      const abortController = new AbortController();
      handleGenerateAuthUrl(abortController.signal);
      setLoginError('');
      return () => abortController.abort();
    }
  }, [isOnline]);

  useEffect(() => {
    setAppLink(`pubkyring://${authUrl}`);
  }, [authUrl]);

  const openApp = () => {
    const newTab = window.open(appLink, '_blank');
    setTimeout(() => {
      if (newTab) newTab.location.href = fallbackUrl;
    }, 2000);
  };

  const handleGenerateAuthUrl = async (signal: AbortSignal, isRetry = false) => {
    if (signal.aborted) return;

    // Increment retry count if this is a retry attempt
    if (isRetry) {
      retryCountRef.current += 1;
    } else {
      retryCountRef.current = 1; // Start with 1 for initial attempt
    }

    const result = await generateAuthUrl();

    if (!result || !result.url) {
      setLoginError('Failed to generate authentication URL.');
      return;
    }

    setAuthUrl(result.url);

    try {
      const pubkey = await result.promise;
      if (!pubkey) {
        setLoginError('Failed to get public key.');
        return;
      }

      const handleLoginResult = await loginWithAuthUrl(pubkey);
      if (handleLoginResult) {
        addAlert('Login successful!');
        router.push('/home');
      }
    } catch (error: unknown) {
      setLoginError(String(error));
      console.error('Login error:', error);

      // Regenerate auth URL on error, but only up to 4 attempts total
      if (!signal.aborted && retryCountRef.current < 4) {
        setTimeout(() => {
          setLoginError('');
          handleGenerateAuthUrl(signal, true);
        }, 2000); // Wait 2 seconds before retrying
      } else if (retryCountRef.current >= 4) {
        // After 4 attempts, stop trying and clear the auth URL
        setAuthUrl('');
        setLoginError(errorRetryMessage);
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
      title={isMobile ? 'Sign\u00A0in\u00A0with' : 'Use'}
      text={`${isMobile ? 'Use' : 'Scan the QR with'} Pubky Ring or any other Pubky Core powered wallet.`}
      imageTitle={
        <Link className="ml-2" href="https://github.com/pubky" target="_blank">
          <Image width={142} height={30} alt="bitkit" src="/images/webp/pubky-ring.webp" />
        </Link>
      }
      className="w-full col-span-2"
    >
      {!isMobile && (
        <div className={`${authUrl && 'cursor-pointer'} relative`} onClick={authUrl ? copyToClipboard : undefined}>
          {authUrl && !isiOSPWA ? (
            <div className="relative w-fit mt-6">
              <QRCodeSVG
                value={authUrl}
                size={qrSize}
                bgColor="#ffffff"
                fgColor="#000000"
                className="bg-white p-2 rounded-lg"
                level="Q"
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
        <div
          onClick={() => loginError === errorRetryMessage && window.location.reload()}
          className={`${loginError === errorRetryMessage ? 'cursor-pointer hover:bg-opacity-20' : ''} flex w-full justify-between items-center px-4 py-2 mt-6 mb-4 rounded-lg border-2 border-red-600 bg-[#e95164] bg-opacity-10`}
        >
          <Typography.Body className="break-words text-red-600" variant="small-bold">
            {Utils.minifyText(loginError, 60)}
          </Typography.Body>
          <div>
            <Icon.Warning color="#dc2626" />
          </div>
        </div>
      )}
      <Content.LinksStoreApp />
      {isMobile && (
        <Button.Medium
          onClick={
            authUrl && !isiOSPWA
              ? () => {
                  copyToClipboard();
                  openApp();
                }
              : undefined
          }
          disabled={!authUrl || isiOSPWA}
          icon={<Icon.Key size="16" color={authUrl && !isiOSPWA ? 'white' : 'gray'} />}
          className="mt-2"
        >
          Authorize with Pubky Ring
          <br />
          <span className={!authUrl || isiOSPWA ? 'block' : 'hidden'}>(Not Available)</span>
        </Button.Medium>
      )}
    </Card.Primary>
  );
}
