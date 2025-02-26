'use client';

import { Icon, Typography } from '@social/ui-shared';
import { DropDown } from '@/components/DropDown';
import { useIsMobile } from '@/hooks/useIsMobile';
import { BottomSheet } from '@/components';

export default function Language() {
  const isMobile = useIsMobile(1024);

  return (
    <div className="p-8 md:p-12 bg-white bg-opacity-10 rounded-lg flex-col justify-start items-start gap-12 inline-flex">
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.GlobeSimple size="24" />
          <Typography.H2>Language</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Choose your preferred language for the Pubky interface.
        </Typography.Body>
        <div className="w-full p-6 bg-white bg-opacity-5 shadow-[0px_20px_40px_0px_rgba(5,5,10,0.50)] rounded-2xl flex-col justify-start items-start gap-2 inline-flex">
          <Typography.Caption className="uppercase text-opacity-30" variant="bold">
            Display language
          </Typography.Caption>
          {isMobile ? <BottomSheet.Languages /> : <DropDown.Languages />}
        </div>
      </div>
    </div>
  );
}
