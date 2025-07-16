'use client';

import DropDown from '@/components/DropDown';
import { useModal } from '@/contexts';
import { Button, Icon, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { useState } from 'react';

type QuestionsType = {
  [key: number]: {
    question: string;
    answer: React.ReactNode;
  };
};

const questions: QuestionsType = {
  1: {
    question: 'How can I update my profile information?',
    answer: (
      <Typography.Body className="text-opacity-80 text-[16px] mr-2 leading-snug" variant="medium">
        If you wish to update your profile, go to your avatar icon at the top right corner of your screen, click on that
        and you will be presented with a screen where you can click the{' '}
        <Link href="/settings/edit">
          <strong>"Edit"</strong>
        </Link>{' '}
        button to update your profile information.
      </Typography.Body>
    )
  },
  2: {
    question: 'How can I delete my post?',
    answer: (
      <Typography.Body className="text-opacity-80 text-[16px] mr-2 leading-snug" variant="medium">
        If you wish to delete a post, simply go to the content piece you wish to remove and click on the three dots on
        the bottom right corner to be presented with a few options. At the very bottom you can see an option to “Delete
        Post”.
      </Typography.Body>
    )
  },
  3: {
    question: 'How do I mute someone?',
    answer: (
      <Typography.Body className="text-opacity-80 text-[16px] mr-2 leading-snug" variant="medium">
        If you wish to mute someone, go to the user&apos;s profile and click on the three dots on their profile. You
        will be presented with multiple options one of which is “Mute user”.
      </Typography.Body>
    )
  },
  4: {
    question: 'How can I restore my account?',
    answer: (
      <Typography.Body className="text-opacity-80 text-[16px] mr-2 leading-snug" variant="medium">
        When signing up for Pubky, you can either scan a QR code with the Pubky Ring mobile app or create a new Pubky.
        <br />
        <br />
        If you use Pubky Ring, it will handle your backup and you'll only need to scan the QR code to sign in again.
        <br />
        <br />
        If you create a new Pubky, it's essential to back it up. There are two ways to do this, whichever way you choose
        to backup your account will be entirely up to you and your preferences.
        <br />
        <br />
        <ul>
          <li>
            <strong>1. Recovery File</strong>
          </li>
          <br />
          To restore via recovery file, first you will need to select the recovery file, which you would have downloaded
          and saved upon signing up to Pubky app.
          <br />
          <br />
          Then you will need to type in the password associated to the recovery file and your account.
          <br />
          <br />
          After you are done, simply click on “Sign In” and you should have access to your profile.
          <br />
          <br />
          <li>
            <strong>2. Recovery Phrase</strong>
          </li>
        </ul>
        <br />
        To restore via recovery phase, you will need to type or paste the 12 word phrase, which you would have taken
        note of when signing up to Pubky app.
        <br />
        <br />
        After you are done, simply click on “Sign In” and you should have access to your profile.
      </Typography.Body>
    )
  },
  5: {
    question: 'How is Pubky different from other social platforms?',
    answer: (
      <Typography.Body className="text-opacity-80 text-[16px] mr-2 leading-snug" variant="medium">
        With Pubky app, you are no longer a passive participant; you are the algorithm. You determine and personalize
        what you see - content feeds, social tagging, and web-of-trust-based curation.
        <br />
        <br />
        Here are some other aspects that make Pubky stand out from the sea of social media platforms:
        <ul>
          <li>
            - The Pubky App is a Progressive Web App (PWA) browser-based or locally installed tool that allows users to
            interact with the Pubky ecosystem. It offers publishing, social tagging, and curation features, letting
            users control every aspect of their web experience.
          </li>
          <li>
            - Keys. Users represent themselves as public keys, removing the need for email or phone numbers and creating
            a self-sovereign identity that is consistent across the entire network.{' '}
          </li>
          <li>
            - Pubky&apos;s Semantic Social Graph (SSG) enables a personalized online experience by using decentralized,
            context-rich tags and user-defined relationships to tailor content discovery and interaction to individual
            interests and values.
          </li>
        </ul>
      </Typography.Body>
    )
  }
};

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
        {Object.keys(questions).map((key) => {
          const questionId = parseInt(key);
          return (
            <DropDown.Question
              key={questionId}
              question={questions[questionId].question}
              answer={questions[questionId].answer}
              open={openQuestionId === questionId}
              setOpen={() => handleQuestionClick(questionId)}
            />
          );
        })}
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
