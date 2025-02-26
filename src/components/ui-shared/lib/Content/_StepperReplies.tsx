import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';
import Link from 'next/link';
import { Utils } from '@social/utils-shared';

interface StepperRepliesProps extends React.HTMLAttributes<HTMLDivElement> {
  urls: string[];
  postUri: string;
  className?: string;
}

export const StepperReplies = ({ urls, postUri, ...rest }: StepperRepliesProps) => {
  const renderStep = (stepNumber: number, url: string) => {
    const isFirstStep = stepNumber === 0;
    const currentStep = urls.length + 1;
    const isLastStep = stepNumber === currentStep - 1;

    const baseCSS =
      'cursor-pointer w-8 h-8 justify-center items-center border rounded-[32px] flex-col gap-2 inline-flex';
    const activeStep = `
      ${
        stepNumber < currentStep - 1
          ? 'bg-white bg-opacity-60 border-white'
          : stepNumber === currentStep - 1
            ? 'bg-white bg-opacity-20 border-white'
            : 'border-white border-opacity-30'
      }`;
    const activeLine = `${stepNumber < currentStep - 1 ? 'bg-white bg-opacity-60' : 'bg-white bg-opacity-30'}`;

    return (
      <React.Fragment key={stepNumber}>
        <Link className={`${baseCSS} ${activeStep} `} href={Utils.encodePostUri(url)}>
          {isFirstStep ? <Icon.ArrowLeft size="16" /> : <Icon.Ellipse size="16" />}
        </Link>
        {!isLastStep && <div className={`h-px flex-1 ${activeLine}`} />}
      </React.Fragment>
    );
  };

  const stepComponents = [...urls.map((url, index) => renderStep(index, url)), renderStep(urls.length, postUri)];

  const numberOfSteps = urls.length + 1;
  const widthPercentage = Math.min(15 + (numberOfSteps - 2) * 5, 100);

  return (
    <div
      {...rest}
      className={twMerge(`flex justify-between items-center`, rest.className)}
      style={{ width: `${widthPercentage}%` }}
    >
      {stepComponents}
    </div>
  );
};
