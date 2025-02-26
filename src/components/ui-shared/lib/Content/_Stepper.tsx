import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep?: number;
  steps?: number;
  className?: string;
}

export const Stepper = ({ currentStep = 1, steps = 3, ...rest }: StepperProps) => {
  const renderStep = (stepNumber: number) => {
    const isLastStep = stepNumber === steps;

    const baseCSS = 'w-8 h-8 justify-center items-center border rounded-[32px] flex-col gap-2 inline-flex';
    const activeStep = `
        ${
          stepNumber < currentStep
            ? 'bg-white border-white'
            : stepNumber === currentStep
              ? 'bg-white bg-opacity-20 border-white'
              : 'border-white border-opacity-30'
        }`;
    const activeLine = `${stepNumber < currentStep ? 'bg-white bg-opacity-60' : 'bg-white bg-opacity-30'}`;

    return (
      <React.Fragment key={stepNumber}>
        <div className={`${baseCSS} ${activeStep} `}>
          {stepNumber < currentStep ? (
            <Icon.Check size="20" color="black" />
          ) : (
            <span
              className={`${
                stepNumber === currentStep ? 'text-white font-semibold' : 'text-white text-opacity-30 font-semibold'
              }`}
            >
              {stepNumber}
            </span>
          )}
        </div>
        {!isLastStep && <div className={`h-px flex-1 ${activeLine}`} />}
      </React.Fragment>
    );
  };

  const stepComponents: JSX.Element[] = [];
  for (let i = 1; i <= steps; i++) {
    stepComponents.push(renderStep(i));
  }

  return (
    <div {...rest} className={twMerge(`w-full flex justify-between items-center mx-auto`, rest.className)}>
      {stepComponents}
    </div>
  );
};
