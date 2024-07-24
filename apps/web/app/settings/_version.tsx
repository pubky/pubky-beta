import { Typography } from '@social/ui-shared';

export default function Version() {
  return (
    <div className="self-start sticky top-[120px] w-full flex-col justify-start items-start gap-2 inline-flex">
      <Typography.H2>Version</Typography.H2>
      <Typography.Body variant="medium" className="text-opacity-80">
        Pubky version v0.12 © Synonym Software Ltd
      </Typography.Body>
    </div>
  );
}
