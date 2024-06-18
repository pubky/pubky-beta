import { Icon, Typography } from '@social/ui-shared';

export default function Simple() {
  return (
    <div className="mb-4 flex-row justify-center w-full">
      <div className={`flex w-full justify-center mt-2`}>
        <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
      </div>
      <Typography.Caption className="mt-1 text-opacity-40 text-center">
        Loading...
      </Typography.Caption>
    </div>
  );
}
