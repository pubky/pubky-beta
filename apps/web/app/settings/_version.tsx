import { SideCard, Typography } from '@social/ui-shared';

export default function Version() {
  return (
    <div className="w-full flex-col justify-start items-start gap-2 inline-flex mt-6">
      <SideCard.Header title="Version" />
      <Typography.Body variant="medium" className="text-opacity-80">
        Pubky version v0.12 © Synonym Software Ltd
      </Typography.Body>
    </div>
  );
}
