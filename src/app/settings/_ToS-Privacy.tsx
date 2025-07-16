import { useModal } from '@/contexts';
import { Button, Icon, SideCard, Typography } from '@social/ui-shared';

export default function ToSAndPrivacy() {
  const { openModal } = useModal();

  return (
    <div className="w-full flex-col justify-start items-start gap-2 inline-flex mb-6">
      <SideCard.Header title="Terms of Service & Privacy" />
      <Typography.Body variant="medium" className="text-opacity-80 leading-snug">
        Please read our terms carefully.
      </Typography.Body>
      <Button.Medium
        onClick={() => openModal('termsOfService')}
        icon={<Icon.FileText size="16" />}
        textCSS="text-[13px]"
        className="py-2 px-3 h-8"
      >
        Terms of service
      </Button.Medium>
      <Button.Medium
        onClick={() => openModal('privacyPolicy')}
        icon={<Icon.LockSimple size="16" />}
        textCSS="text-[13px]"
        className="py-2 px-3 h-8"
      >
        Privacy Policy
      </Button.Medium>
    </div>
  );
}
