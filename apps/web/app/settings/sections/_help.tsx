import DropDown from '@/components/DropDown';
import { Button, Icon, Typography } from '@social/ui-shared';
import { useState } from 'react';

type QuestionsType = {
  [key: number]: {
    question: string;
    answer: string;
  };
};

const questions: QuestionsType = {
  1: {
    question: 'How can I update my profile information?',
    answer:
      'Click on your profile picture to open your profile. Then click the [edit] button to update your bio, name, links, or profile picture.',
  },
  2: {
    question: 'How can I delete my post?',
    answer:
      'Click on your profile picture to open your profile. Then click the [edit] button to update your bio, name, links, or profile picture.',
  },
  3: {
    question: 'How do I mute someone?',
    answer:
      'Click on your profile picture to open your profile. Then click the [edit] button to update your bio, name, links, or profile picture.',
  },
  4: {
    question: 'How can I restore my account?',
    answer:
      'Click on your profile picture to open your profile. Then click the [edit] button to update your bio, name, links, or profile picture.',
  },
  5: {
    question: 'How is Pubky different from other social platforms?',
    answer:
      'Click on your profile picture to open your profile. Then click the [edit] button to update your bio, name, links, or profile picture.',
  },
};

export default function Help() {
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);

  const handleQuestionClick = (id: number) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  return (
    <div className="p-12 bg-white bg-opacity-10 rounded-2xl flex-col justify-start items-start gap-12 inline-flex">
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
        <div className="w-full h-px bg-white bg-opacity-10 my-6" />
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.ChatCircleText size="24" />
          <Typography.H2>User Guide</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          The Pubky User Guide will help you navigate through the app, utilize
          its key features, and get the most out of your Pubky experience.
        </Typography.Body>
        <Button.Large
          variant="secondary"
          className="w-auto"
          onClick={() =>
            window.open(
              'https://docs.google.com/document/d/1BHF-rOB31wXsQgC1w7scRaYBlxo9fwu8ygV28x_fEOE/edit?usp=sharing'
            )
          }
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
          Cannot find the answer you&apos;re looking for? Pubky support will
          help you out in no time.
        </Typography.Body>
        <Button.Large
          variant="secondary"
          className="w-auto cursor-default"
          disabled
          icon={<Icon.Telegram width="16" height="16" color="gray" />}
        >
          Pubky Support (Telegram)
        </Button.Large>
      </div>
    </div>
  );
}
