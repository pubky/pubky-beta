'use client';

import { usePubkyClientContext } from '@/contexts';
import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import axios from 'axios';
import { useState } from 'react';
import { PostView } from '@/types/Post';
import InputReport from './Components/InputReport';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';

interface ReportProfileProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalReportPostRef: React.RefObject<HTMLDivElement>;
  pk: string;
  name: string | undefined;
}

export default function ReportProfile({
  showModal,
  setShowModal,
  modalReportPostRef,
  pk,
  name,
}: ReportProfileProps) {
  const { profile, pubky } = usePubkyClientContext();
  const [selectedItem, setSelectedItem] = useState<string>('Privacy');
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const items = [
    { icon: <Icon.Lock size="24" />, title: 'Privacy' },
    { icon: <Icon.SmileySad size="24" />, title: 'Hate or Threat' },
    { icon: <Icon.Trash size="24" />, title: 'Spam or Scam' },
    { icon: <Icon.ImageSquare size="24" />, title: 'Sensitive Content' },
    { icon: <Icon.Copy size="24" />, title: 'Copyright Infringement' },
    { icon: <Icon.User size="24" />, title: 'Impersonation' },
    { icon: <Icon.Shield size="24" />, title: 'Child Safety' },
    { icon: <Icon.WarningOctagon size="24" />, title: 'Suicide or Self-harm' },
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post('/api/chatwoot', {
        message: `${window.location.origin}/profile/${pk} \n\n ${message}`,
        name: profile?.name,
        email: `${pubky}@pubky.app`,
        source: `Report User - ${selectedItem}`,
      });
      setSent(true);
      setLoading(false);
      setMessage('');
    } catch (error) {
      console.error(error);
      setError(true);
      setLoading(false);
    }
  };

  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalReportPostRef}
      className="lg:w-[588px] max-w-[1200px] max-h-[600] overflow-y-auto"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      {showInput ? (
        <>
          <InputReport
            error={error}
            setError={setError}
            sent={sent}
            setSent={setSent}
            profile={profile}
            message={message}
            setMessage={setMessage}
            handleSubmit={handleSubmit}
            loading={loading}
            setShowModal={setShowModal}
            name={name}
            pk={pk}
          />
        </>
      ) : (
        <>
          <Modal.Header title="Report User" />
          <Typography.Body className="text-left my-6" variant="medium">
            <span className="opacity-80">Why are you reporting user </span>
            <Link
              href={`/profile/${pk}`}
              className="font-bold hover:underline hover:decoration-solid"
            >
              {Utils.minifyText(name ?? pk, 20)}
            </Link>{' '}
            <span className="uppercase opacity-80">
              ({Utils.minifyPubky(pk)})?
            </span>
          </Typography.Body>
          <div className="w-full">
            {items.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer w-full py-2 gap-4 justify-between flex items-center border-b border-transparent hover:border-white/30 hover:bg-gradient-to-t from-white/10 to-transparent"
                onClick={() => setSelectedItem(item.title)}
              >
                <div className="flex gap-2">
                  {item.icon}
                  <Typography.Body variant="medium-bold">
                    {item.title}
                  </Typography.Body>
                </div>
                {selectedItem === item.title && (
                  <div>
                    <Icon.Check size="24" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {!showInput && (
        <div className="flex gap-4 mt-8">
          <Button.Large
            id="cancel-report"
            onClick={() => setShowModal(false)}
            variant="secondary"
          >
            Cancel
          </Button.Large>
          <Button.Large onClick={() => setShowInput(true)} id="next-report">
            Next
          </Button.Large>
        </div>
      )}
    </Modal.Root>
  );
}
