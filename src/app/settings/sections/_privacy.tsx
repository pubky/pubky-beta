'use client';

import { Icon, Input, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useEffect, useState } from 'react';

export default function PrivacySafety() {
  const [isChecked, setIsChecked] = useState(true);
  const [isBlurChecked, setIsBlurChecked] = useState(true);
  const defaultChecked = Utils.storage.get('checkLink');
  const defaultBlurChecked = Utils.storage.get('blurCensored');

  useEffect(() => {
    if (defaultChecked !== null) setIsChecked(Boolean(defaultChecked));
    if (defaultBlurChecked !== null) setIsBlurChecked(Boolean(defaultBlurChecked));
  }, [defaultChecked, defaultBlurChecked]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    Utils.storage.set('checkLink', !isChecked);
  };

  const handleBlurCheckboxChange = () => {
    setIsBlurChecked(!isBlurChecked);
    Utils.storage.set('blurCensored', !isBlurChecked);
  };

  return (
    <div className="p-8 md:p-12 bg-white bg-opacity-10 rounded-lg flex-col justify-start items-start gap-12 inline-flex">
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.Shield size="24" />
          <Typography.H2>Privacy and Safety</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Privacy is not a crime. Manage your visibility and safety on Pubky.
        </Typography.Body>
        <div className="w-full p-6 bg-white bg-opacity-5 shadow-[0px_20px_40px_0px_rgba(5,5,10,0.50)] rounded-2xl flex-col justify-start items-start gap-6 inline-flex">
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">Show confirmation before redirecting</Typography.Body>
            <Input.Switch checked={isChecked} onChange={handleCheckboxChange} />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">Blur censored posts or profile pictures</Typography.Body>
            <Input.Switch checked={isBlurChecked} onChange={handleBlurCheckboxChange} />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">Sign me out when inactive for 5 minutes</Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">Require PIN when inactive for 5 minutes</Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">Hide your profile in &apos;Who to Follow&apos;</Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">Hide your profile in &apos;Active Friends&apos;</Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">Hide your profile in search results</Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">Never show posts from people you don&apos;t follow</Typography.Body>
            <Input.Switch disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
