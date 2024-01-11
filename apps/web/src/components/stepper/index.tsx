import React from 'react';

interface StepperProps {
  currentStep?: number;
  steps?: number;
}

const Stepper = ({ currentStep = 1, steps = 3 }: StepperProps) => {
  const renderStep = (stepNumber: number) => {
    const isLastStep = stepNumber === steps;

    return (
      <>
        <div
          className={`w-8 h-8 flex justify-center items-center border rounded-full relative`}
          style={
            stepNumber < currentStep
              ? {
                  borderImage:
                    'conic-gradient(from -45deg at 50% 50%, #FD00FF 0deg, #00FF5D 118.12deg, #004BFF 238.12deg, #FD00FF 360deg) 1',
                  backgroundImage:
                    'conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.5) 0deg, rgba(0, 255, 93, 0.5) 118.12deg, rgba(0, 75, 255, 0.5) 238.12deg, rgba(253, 0, 255, 0.5) 360deg), conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.5) 0deg, rgba(0, 255, 93, 0.5) 118.12deg, rgba(0, 75, 255, 0.5) 238.12deg, rgba(253, 0, 255, 0.5) 360deg)',
                }
              : stepNumber === currentStep
              ? {
                  borderImage:
                    'conic-gradient(from -45deg at 50% 50%, #FD00FF 0deg, #00FF5D 118.12deg, #004BFF 238.12deg, #FD00FF 360deg) 1',
                  backgroundImage:
                    'conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.1) 0deg, rgba(0, 255, 93, 0.1) 118.12deg, rgba(0, 75, 255, 0.1) 238.12deg, rgba(253, 0, 255, 0.1) 360deg), conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.1) 0deg, rgba(0, 255, 93, 0.1) 118.12deg, rgba(0, 75, 255, 0.1) 238.12deg, rgba(253, 0, 255, 0.1) 360deg)',
                }
              : { borderColor: '#FFFFFF52' }
          }
        >
          <span className="text-center">
            {stepNumber < currentStep ? (
              <svg
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {' '}
                <path
                  d="M1.10669 6.53353L4.84002 10.2669L13.9067 1.2002"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{' '}
              </svg>
            ) : (
              <span
                className={`${
                  stepNumber === currentStep ? 'text-white' : 'text-[#FFFFFF52]'
                }`}
              >
                {stepNumber}
              </span>
            )}
          </span>
        </div>
        {!isLastStep && (
          <div
            className="h-px flex-1"
            style={
              stepNumber < currentStep
                ? {
                    backgroundImage:
                      'conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.2) 0deg, rgba(0, 255, 93, 0.2) 118.12deg, rgba(0, 75, 255, 0.2) 238.12deg, rgba(253, 0, 255, 0.2) 360deg), conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.2) 0deg, rgba(0, 255, 93, 0.2) 118.12deg, rgba(0, 75, 255, 0.2) 238.12deg, rgba(253, 0, 255, 0.2) 360deg)',
                  }
                : { backgroundColor: '#FFFFFF52' }
            }
          ></div>
        )}
      </>
    );
  };

  const stepComponents = [];
  for (let i = 1; i <= steps; i++) {
    stepComponents.push(renderStep(i));
  }

  return (
    <div className="flex justify-between items-center w-3/4 mx-auto">
      {stepComponents}
    </div>
  );
};

export default Stepper;
