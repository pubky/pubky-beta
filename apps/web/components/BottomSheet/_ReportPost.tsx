'use client';

import InputReport from '@/components/Modal/_ReportPost/components/InputReport';
import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { BottomSheet, Button, Icon, Typography } from '@social/ui-shared';
import axios from 'axios';
import { useState } from 'react';

interface ReportPostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function ReportPost({
  show,
  setShow,
  post,
  title,
  className,
}: ReportPostProps) {
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
        message: `${window.location.origin}/post/${post?.details?.author}/${post?.details?.id} \n\n ${message}`,
        name: profile?.name,
        email: `${pubky}@pubky.app`,
        source: `Report Post - ${selectedItem}`,
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
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
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
            setShowModal={setShow}
          />
        </>
      ) : (
        <>
          <Typography.H1>Report Post</Typography.H1>
          <Typography.Body className="text-opacity-80 my-6" variant="medium">
            What sort of issue are you reporting?
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
            onClick={() => setShow(false)}
            variant="secondary"
          >
            Cancel
          </Button.Large>
          <Button.Large onClick={() => setShowInput(true)} id="next-report">
            Next
          </Button.Large>
        </div>
      )}
    </BottomSheet.Root>
  );
}
