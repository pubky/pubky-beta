import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'warning' | 'connection' | 'homeserver' | 'loading';
  isOnline?: boolean;
  isUp?: boolean;
  isLosingConnection?: boolean;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const Message = ({
  icon,
  children,
  variant = 'default',
  isOnline,
  isUp,
  isLosingConnection,
  onRetry,
  isRetrying,
  ...rest
}: MessageProps) => {
  const baseCSS = `z-max relative py-2 px-4 rounded-md shadow border w-full`;

  let variantCSS = '';
  let colorTextCSS = '';

  switch (variant) {
    case 'warning':
      variantCSS = 'bg-yellow-600 shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] border-yellow-500';
      colorTextCSS = 'text-white';
      break;
    case 'loading':
      variantCSS =
        'bg-[#C8FF00] bg-opacity-10 shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] border-[#C8FF00]';
      colorTextCSS = 'text-[#c8ff00]';
      break;
    case 'connection':
      if (isOnline) {
        variantCSS =
          'bg-[#c8ff00] bg-opacity-10 shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] border-[#C8FF00]';
        colorTextCSS = 'text-[#c8ff00]';
      } else if (isLosingConnection) {
        variantCSS =
          'bg-yellow-600 bg-opacity-10 shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] border-yellow-500';
        colorTextCSS = 'text-yellow-500';
      } else {
        variantCSS =
          'bg-[#e95164] bg-opacity-10 shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] border-[#e95164]';
        colorTextCSS = 'text-[#e95164]';
      }
      break;
    case 'homeserver':
      if (isUp) {
        variantCSS =
          'bg-[#c8ff00] bg-opacity-10 shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] border-[#C8FF00]';
        colorTextCSS = 'text-[#c8ff00]';
      } else {
        variantCSS =
          'bg-[#e95164] bg-opacity-10 shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] border-[#e95164]';
        colorTextCSS = 'text-[#e95164]';
      }
      break;
    case 'default':
    default:
      variantCSS =
        'bg-[#C8FF00] bg-opacity-10 shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] border-[#C8FF00]';
      colorTextCSS = 'text-[#c8ff00]';
      break;
  }

  return (
    <div id="message-alert" {...rest} className={twMerge(baseCSS, variantCSS, rest.className)}>
      <div className="flex flex-wrap gap-1 items-center justify-center">
        {icon && <div className="relative">{icon}</div>}
        <Typography.Body className={twMerge(colorTextCSS, 'text-center text-opacity-80')} variant="small">
          {children}
        </Typography.Body>
        {onRetry && variant === 'homeserver' && !isUp && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="ml-2 underline text-[#e95164] hover:text-[#c8ff00] transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <Typography.Body className={twMerge(colorTextCSS, 'text-opacity-80')} variant="small">
              {isRetrying ? 'Trying...' : 'Try again'}
            </Typography.Body>
          </button>
        )}
      </div>
    </div>
  );
};
