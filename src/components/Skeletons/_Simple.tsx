import { Icon, Typography } from '@social/ui-shared';

interface SimpleProps {
  retryCount?: number;
  maxRetries?: number;
}

export default function Simple({ retryCount = 0, maxRetries = 3 }: SimpleProps) {
  const getLoadingMessage = () => {
    if (retryCount === 0) return 'Loading...';
    return `Checking for new content... (${retryCount}/${maxRetries})`;
  };

  return (
    <div className="mb-4 flex-row justify-center w-full">
      <div className={`flex w-full justify-center mt-2`}>
        <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
      </div>
      <Typography.Caption className="mt-1 text-opacity-40 text-center">{getLoadingMessage()}</Typography.Caption>
    </div>
  );
}
