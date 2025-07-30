'use client';

import DropDown from '@/components/DropDown';
import { useModal } from '@/contexts';
import { Button, Icon, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { useState } from 'react';

type QuestionType = {
  id: number;
  question: string;
  answer: React.ReactNode;
};

type SectionType = {
  id: string;
  title: string;
  questions: QuestionType[];
};

const createAnswer = (content: React.ReactNode) => (
  <Typography.Body className="text-opacity-80 text-[16px] mr-2 leading-snug" variant="medium">
    {content}
  </Typography.Body>
);

const sections: SectionType[] = [
  {
    id: 'onboarding',
    title: '1. Getting Started & Onboarding',
    questions: [
      {
        id: 1,
        question: 'Why does Pubky require invite codes?',
        answer: createAnswer(
          "Pubky uses invite codes as a temporary measure to prevent spam and server overload. Users need an invite code to create a user on our Homeserver. We don't create a user for the Pubky App, but on our Homeserver. As the infrastructure improves and more homeservers come online, invite codes may no longer be necessary."
        )
      },
      {
        id: 2,
        question: 'How do I use Pubky Ring with the web app?',
        answer: createAnswer(
          'First, create your keypair in the Pubky Ring app. Then visit the Pubky web app and log in using the same keypair. The apps are connected through your cryptographic identity.'
        )
      },
      {
        id: 3,
        question: 'Why does login sometimes fail when using the PWA on Android?',
        answer: createAnswer(
          <>
            Some browsers focused on security and privacy, like Vanadium or Tor, disable Just-In-Time (JIT) compilation
            for JavaScript by default, which prevents Pubky App from functioning properly.
            <br />
            <br />
            To enable it, go to: Settings &gt; Site settings &gt; JavaScript JIT &gt; Allowed.
          </>
        )
      }
    ]
  },
  {
    id: 'backup',
    title: '2. Backups & Account Recovery',
    questions: [
      {
        id: 4,
        question: 'How can I restore my account?',
        answer: createAnswer(
          <>
            When you signed up, you were prompted to back up your identity using one of the following:
            <ul className="list-disc ml-6">
              <li>Recovery file (.pkarr)</li>
              <li>Recovery phrase (mnemonic)</li>
              <li>QR code</li>
            </ul>
            <br />
            To restore with a .pkarr file:{' '}
            <ol className="list-decimal ml-6">
              <li>Select the file you saved.</li>
              <li>Enter your password.</li>
              <li>Click "Sign In".</li>
            </ol>
          </>
        )
      },
      {
        id: 5,
        question: 'Can I restore my Pubky account on another device?',
        answer: createAnswer(
          'Yes, if you have your .pkarr file or seed phrase. (Seed phrase support will be added in future versions of Pubky Ring.)'
        )
      },
      {
        id: 6,
        question: 'Can I convert a seed phrase into a .pkarr file later?',
        answer: createAnswer('Not yet. This functionality is planned for a future update.')
      },
      {
        id: 7,
        question: "I backed up my account but can't access the file. What happened?",
        answer: createAnswer(
          'Some operating systems may rename the .pkarr file or mislabel it. Try renaming the file extension to .pkarr and reimporting.'
        )
      },
      {
        id: 8,
        question: 'I downloaded a .txt file instead of a .pkarr backup. What do I do?',
        answer: createAnswer(
          'This happens if you chose the mnemonic (seed phrase) backup option. Pubky Ring does not yet support seed import. Wait for future updates or recreate your account with a .pkarr backup.'
        )
      },
      {
        id: 9,
        question: 'I missed downloading the recovery file. Can I back up again?',
        answer: createAnswer(
          'Currently, backups can only be created once via the web app. This may change in future updates.'
        )
      }
    ]
  },
  {
    id: 'profile',
    title: '3. Profile & Social Features',
    questions: [
      {
        id: 10,
        question: 'How can I update my profile information?',
        answer: createAnswer('Click your avatar (top-right corner), then click "Edit" to update your profile info')
      },
      {
        id: 11,
        question: 'How can I delete my post?',
        answer: createAnswer('Hover over the three dots on the post you wish to delete and select "Delete Post".')
      },
      {
        id: 12,
        question: 'How do I mute someone?',
        answer: createAnswer('Go to their profile, click the three dots, and choose "Mute User".')
      }
    ]
  },
  {
    id: 'pubky',
    title: '4. How Pubky App Works',
    questions: [
      {
        id: 13,
        question: 'How is Pubky different from other social media platforms?',
        answer: createAnswer(
          <>
            Pubky is built for self-sovereign, decentralized social interaction. Key differences:
            <ul className="list-disc ml-6">
              <li>You are the algorithm: customize what you see with semantic tags and curation.</li>
              <li>No email or phone required: your identity is your public key.</li>
              <li>Full control over your social graph via tagging and trust models.</li>
              <li>Browser-based PWA that respects privacy.</li>
            </ul>
          </>
        )
      },
      {
        id: 14,
        question: 'How does Pubky differ from Nostr?',
        answer: createAnswer(
          'Pubky uses Ed25519 keys for compatibility and avoids centralized relays. Instead, it uses a Distributed Hash Table (DHT) for decentralized lookup and identity resolution.'
        )
      }
    ]
  }
];

type FAQSectionProps = {
  section: SectionType;
  openQuestionId: number | null;
  onQuestionClick: (id: number) => void;
};

const FAQSection = ({ section, openQuestionId, onQuestionClick }: FAQSectionProps) => (
  <>
    <Typography.H2>{section.title}</Typography.H2>
    {section.questions.map((question) => (
      <DropDown.Question
        key={question.id}
        question={question.question}
        answer={question.answer}
        open={openQuestionId === question.id}
        setOpen={() => onQuestionClick(question.id)}
      />
    ))}
  </>
);

export default function Help() {
  const { openModal } = useModal();
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);

  const handleQuestionClick = (id: number) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  return (
    <div className="p-8 md:p-12 bg-white bg-opacity-10 rounded-lg flex-col justify-start items-start gap-12 inline-flex">
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.Question size="24" />
          <Typography.H2>FAQ</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Frequently asked questions from Pubky users
        </Typography.Body>

        {sections.map((section) => (
          <FAQSection
            key={section.id}
            section={section}
            openQuestionId={openQuestionId}
            onQuestionClick={handleQuestionClick}
          />
        ))}

        <div className="xl:hidden flex flex-col gap-6">
          <div className="w-full h-px bg-white bg-opacity-10 my-6" />
          <div className="justify-start items-center gap-2 inline-flex">
            <Icon.ChatCircleText size="24" />
            <Typography.H2>Feedback</Typography.H2>
          </div>
          <Typography.Body variant="medium" className="text-opacity-80">
            What do you think about Pubky? Send us your feedback to improve or add new features that you would like to
            see in the next releases.
          </Typography.Body>
          <Button.Large
            variant="secondary"
            className="w-fit"
            onClick={() => openModal('feedback')}
            icon={<Icon.ChatCircleText width="16" height="16" />}
          >
            Send Feedback
          </Button.Large>
        </div>
        <div className="w-full h-px bg-white bg-opacity-10 my-6" />
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.FileText size="24" />
          <Typography.H2>User Guide</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          The Pubky User Guide will help you navigate through the app, utilize its key features, and get the most out of
          your Pubky experience.
        </Typography.Body>
        <Button.Large
          variant="secondary"
          className="w-auto"
          onClick={() => window.open('https://support.synonym.to/hc/pubky-app-help-center/en')}
          icon={<Icon.FileText width="16" height="16" />}
        >
          User Guide
        </Button.Large>
        <div className="w-full h-px bg-white bg-opacity-10 my-6" />
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.ChatCircleText size="24" />
          <Typography.H2>Support</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Cannot find the answer you&apos;re looking for? Pubky support will help you out in no time.
        </Typography.Body>
        <Button.Large
          variant="secondary"
          className="w-auto"
          onClick={() => window.open('https://t.me/pubkychat', '_blank')}
          icon={<Icon.Telegram width="16" height="16" />}
        >
          Pubky Support (Telegram)
        </Button.Large>
        <div className="xl:hidden flex flex-col gap-6">
          <div className="w-full h-px bg-white bg-opacity-10 my-6" />
          <div className="justify-start items-center gap-2 inline-flex">
            <div>
              <Icon.FileText size="24" />
            </div>
            <Typography.H2>Terms of Service & Privacy</Typography.H2>
          </div>
          <Typography.Body variant="medium" className="text-opacity-80">
            Please read our terms carefully.
          </Typography.Body>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button.Large
              variant="secondary"
              className="w-fit"
              onClick={() => openModal('termsOfService')}
              icon={<Icon.ChatCircleText width="16" height="16" />}
            >
              Terms of Service
            </Button.Large>
            <Button.Large
              variant="secondary"
              className="w-fit"
              onClick={() => openModal('privacyPolicy')}
              icon={<Icon.ChatCircleText width="16" height="16" />}
            >
              Privacy Policy
            </Button.Large>
          </div>
        </div>
      </div>
    </div>
  );
}
