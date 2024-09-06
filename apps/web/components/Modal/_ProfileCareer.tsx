'use client';

import { useClientContext } from '@/contexts';
import { IExperience, IExperienceComplete } from '@/types';
import { Content, Icon, Modal, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useEffect, useRef } from 'react';

interface ProfileCareerProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  experience?: IExperienceComplete;
  pic?: string;
  username: string | JSX.Element;
  creatorPubky?: string | null;
}

export default function ProfileCareer({
  showModal,
  setShowModal,
  experience,
  pic,
  username,
  creatorPubky,
}: ProfileCareerProps) {
  const { pubky } = useClientContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const experiences = experience?.experiences;

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalRef, setShowModal]);

  const monthOrder: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getMonthIndex = (month: string): number => monthOrder.indexOf(month);

  const getComparableDate = (exp: IExperience): [number, number] => {
    return exp.endDate.month === 'Present'
      ? [-Infinity, -Infinity]
      : [getMonthIndex(exp.endDate.month), parseInt(exp.endDate.year, 10)];
  };

  const sortedExperiences =
    experiences &&
    experiences.sort((a, b) => {
      const isPresentA = a.endDate.month === 'Present';
      const isPresentB = b.endDate.month === 'Present';

      if (isPresentA && !isPresentB) return -1;
      if (!isPresentA && isPresentB) return 1;

      const [monthA, yearA] = getComparableDate(a);
      const [monthB, yearB] = getComparableDate(b);

      return yearB - yearA || monthB - monthA;
    });

  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalRef}
      className="w-[792px] max-h-[650px] overflow-y-auto justify-start"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="flex gap-2">
        <Modal.Header title="Career:" />
        <SideCard.User
          uri={creatorPubky ?? pubky ?? ''}
          className="mt-2"
          uriImage={pic || '/images/Userpic.png'}
          username={
            typeof username === 'string' ? Utils.minifyText(username, 16) : ''
          }
          label={Utils.minifyPubky(creatorPubky ?? pubky ?? '')}
        />
      </div>
      {experience && (
        <div>
          <div className="flex gap-6 items-center">
            {experience.cv && typeof experience?.cv === 'string' && (
              <div
                onClick={() => {
                  if (typeof experience?.cv === 'string') {
                    window.open(experience.cv, '_blank');
                  }
                }}
                className="mt-6 flex gap-2 items-center opacity-80 hover:opacity-100 cursor-pointer px-4 py-2 border border-white border-opacity-30 hover:border-opacity-50 border-dashed rounded-2xl"
              >
                <Icon.Eye size="16" />
                <Typography.Body variant="small">
                  CV_
                  {typeof username === 'string'
                    ? Utils.minifyText(username, 16)
                    : ''}
                </Typography.Body>
              </div>
            )}
            {experience.contact && (
              <Typography.Body className="mt-6" variant="medium-bold">
                {experience.contact}
              </Typography.Body>
            )}
          </div>
          <div className="flex flex-col gap-4 mt-10 justify-start text-left">
            <Typography.Body variant="large-bold">Experience</Typography.Body>
            {sortedExperiences && sortedExperiences.length > 0 ? (
              sortedExperiences.map((experience, index) => (
                <div
                  key={index}
                  className="relative w-full flex flex-col gap-4"
                >
                  <div>
                    <Typography.Body variant="medium-bold">
                      {experience.title}
                    </Typography.Body>
                    <Typography.Body
                      variant="small"
                      className="text-opacity-80"
                    >
                      {experience.companyName} · {experience.employmentType}
                    </Typography.Body>
                    <Typography.Body
                      variant="small"
                      className="text-opacity-50"
                    >
                      {experience.startDate.month} {experience.startDate.year} -{' '}
                      {experience.endDate.month === 'Present'
                        ? 'Present'
                        : `${experience.endDate.month} ${experience.endDate.year}`}
                    </Typography.Body>
                    <Typography.Body
                      variant="small"
                      className="text-opacity-50"
                    >
                      {experience.location} · {experience.locationType}
                    </Typography.Body>
                    {experience.description && (
                      <Typography.Body variant="small" className="mt-4">
                        {experience.description}
                      </Typography.Body>
                    )}
                  </div>
                  {index < sortedExperiences.length - 1 && <Content.Divider />}
                </div>
              ))
            ) : (
              <Typography.Body variant="medium" className="text-opacity-50">
                No experience yet
              </Typography.Body>
            )}
          </div>
        </div>
      )}
    </Modal.Root>
  );
}
