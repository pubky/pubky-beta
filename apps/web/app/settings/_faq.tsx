import { Button, Icon, SideCard, Typography } from '@social/ui-shared';

const faqQuestions = [
  'How can I update my profile information?',
  'How can I delete my post?',
  'How do I mute someone?',
  'How can I restore my account?',
  'How is Pubky different from other social platforms?',
];

export default function Faq() {
  return (
    <div className="w-full flex-col justify-start items-start gap-2 inline-flex">
      <SideCard.Header title="FAQ" />
      {faqQuestions.map((question, index) => (
        <div
          key={index}
          className="relative w-full p-6 rounded-2xl border border-white border-opacity-20 flex-col justify-start items-start gap-6 inline-flex"
        >
          <Typography.Body variant="medium-bold">{question}</Typography.Body>
          <div className="absolute right-3 bottom-3">
            <Icon.Next size="16" color="gray" />
          </div>
        </div>
      ))}
      <Button.Medium
        icon={<Icon.Question size="16" color="gray" />}
        className="py-2 px-3 h-8"
        disabled
      >
        More FAQ
      </Button.Medium>
    </div>
  );
}
