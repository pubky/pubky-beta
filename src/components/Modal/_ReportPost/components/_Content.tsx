'use client';

import { usePubkyClientContext } from '@/contexts';
import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import axios from 'axios';
import { useState } from 'react';
import { PostView } from '@/types/Post';
import InputReport from './InputReport';

interface ReportPostProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentReportPost({ setShowModal, post, setShowMenu }: ReportPostProps) {
  const { profile, pubky } = usePubkyClientContext();
  const [selectedItem, setSelectedItem] = useState<string>('Personal Info Leak');
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const items = [
    { icon: <Icon.UserRectangle size="24" />, title: 'Personal Info Leak' },
    { icon: <Icon.SmileySad size="24" />, title: 'Hate or Threatening Speech' },
    { icon: <Icon.Hand size="24" />, title: 'Harassment or Targeted' },
    { icon: <Icon.Pedestrian size="24" />, title: 'Child Sexual Abuse or Exploitation' },
    { icon: <Icon.Megaphone size="24" />, title: 'Promotion of Terrorist' },
    { icon: <Icon.ShieldWarning size="24" />, title: 'Graphic or Criminal Violence' },
    { icon: <Icon.Handbag size="24" />, title: 'Illegal Sales or Criminal' },
    { icon: <Icon.Fire size="24" />, title: 'Non-consensual or Criminal Sexual Content' }
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post('/api/chatwoot', {
        message: `${window.location.origin}/post/${post?.details?.author}/${post?.details?.id} \n\n ${message}`,
        name: profile?.name,
        email: `${pubky}@pubky.app`,
        source: `Report Post - ${selectedItem}`
      });
      setSent(true);
      setLoading(false);
      setMessage('');
      setShowMenu(false);
    } catch (error) {
      console.error(error);
      setError(true);
      setLoading(false);
    }
  };

  return (
    <>
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
          />
        </>
      ) : (
        <>
          <Modal.Header title="Report Post" />
          <Typography.Body className="text-opacity-80 my-6" variant="medium">
            What sort of issue are you reporting?
          </Typography.Body>
          <div className="w-full">
            {items.map((item, index) => (
              <div
                key={index}
                className={`cursor-pointer w-full py-3 gap-4 justify-between flex items-center ${selectedItem === item.title ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                onClick={() => setSelectedItem(item.title)}
              >
                <div className="flex gap-2">
                  {item.icon}
                  <Typography.Body variant="medium-bold">{item.title}</Typography.Body>
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
          <Button.Large id="cancel-report" onClick={() => setShowModal(false)} variant="secondary">
            Cancel
          </Button.Large>
          <Button.Large onClick={() => setShowInput(true)} id="next-report">
            Next
          </Button.Large>
        </div>
      )}
    </>
  );
}
