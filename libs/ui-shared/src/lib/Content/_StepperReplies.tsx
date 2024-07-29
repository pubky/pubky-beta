import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';
import Link from 'next/link';
import { Utils } from '@social/utils-shared';

interface StepperRepliesProps extends React.HTMLAttributes<HTMLDivElement> {
  urls: string[];
  rootParent: string;
  className?: string;
}

export const StepperReplies = ({
  urls,
  rootParent,
  ...rest
}: StepperRepliesProps) => {
  const renderStep = (stepNumber: number, url?: string) => {
    const isFirstStep = stepNumber === 0;
    const currentStep = urls.length;
    const isLastStep = stepNumber === urls.length;

    const baseCSS =
      'cursor-pointer w-8 h-8 justify-center items-center border rounded-[32px] flex-col gap-2 inline-flex';
    const activeStep = `
      ${
        stepNumber < currentStep
          ? 'bg-fuchsia-500 bg-opacity-60 border-fuchsia-500'
          : stepNumber === currentStep
          ? 'bg-fuchsia-500 bg-opacity-20 border-fuchsia-500'
          : 'border-white border-opacity-30'
      }`;
    const activeLine = `${
      stepNumber < currentStep
        ? 'bg-fuchsia-500 bg-opacity-60'
        : 'bg-white bg-opacity-30'
    }`;

    return (
      <React.Fragment key={stepNumber}>
        <Link
          className={`${baseCSS} ${activeStep} `}
          href={Utils.encodePostUri((window.location.href = url || rootParent))}
        >
          {isFirstStep ? (
            <Icon.ArrowLeft size="16" />
          ) : (
            <Icon.Ellipse size="16" />
          )}
        </Link>
        {!isLastStep && <div className={`h-px flex-1 ${activeLine}`} />}
      </React.Fragment>
    );
  };

  const stepComponents = [
    renderStep(0, rootParent),
    ...urls.map((url, index) => renderStep(index + 1, url)),
  ];

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
