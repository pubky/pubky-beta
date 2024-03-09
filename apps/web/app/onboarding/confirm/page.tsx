import { Button, Typography } from '@social/ui-shared';
import { Onboarding } from '../components';
import Image from 'next/image';
import Link from 'next/link';

export default function Index() {
  return (
    <Onboarding.Layout currentStep={3}>
      <Typography.Display>Ready to go!</Typography.Display>
      <Typography.PageTitle className="text-opacity-50 mt-4 lg:mt-0">
        Welcome to Pubky. Your keys, your content, your rules.
      </Typography.PageTitle>
      <div className="w-full h-[434px] sm:h-[534px] justify-center items-center inline-flex">
        <Image
          width={384}
          height={384}
          src="/images/confirm.png"
          alt="confirm"
          className="scale-75 sm:scale-100"
        />
      </div>
      <div className="flex-col justify-center items-center flex">
        <Link href="/home" className="w-full sm:w-80">
          <Button.Large>Start exploring</Button.Large>
        </Link>
      </div>
    </Onboarding.Layout>
  );
}
