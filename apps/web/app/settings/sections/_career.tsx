import { Skeleton } from '@/components';
import Modal from '@/components/Modal';
import { useAlertContext, useClientContext } from '@/contexts';
import { IExperience } from '@/types';
import { Button, Content, Icon, Input, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useEffect, useState } from 'react';

export default function Career() {
  const { pubky, getUserIndexed, updateExperiences, deleteFile } =
    useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [fileName, setFileName] = useState('Add CV');
  const [CVFile, setCVFile] = useState<File | undefined>();
  const [contact, setContact] = useState('');
  const [experiences, setExperiences] = useState<IExperience[]>();
  const [showModalCareer, setShowModalCareer] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<IExperience | null>(
    null
  );
  const [experienceIndexToEdit, setExperienceIndexToEdit] = useState<
    number | null
  >(null);

  const UploadCVFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(file.name);
      setCVFile(file);
    }
  };

  async function fetchProfile() {
    try {
      setLoadingUser(true);
      if (!pubky) return;

      const userProfile = await getUserIndexed(pubky);
      if (userProfile) {
        setCVFile(userProfile?.profile?.experience?.cv);
        if (userProfile?.profile?.experience?.cv)
          setFileName(`cv_${userProfile.profile.name}`);
        setContact(userProfile?.profile?.experience?.contact || '');
        setExperiences(userProfile?.profile?.experience?.experiences);
      }
      setLoadingUser(false);
    } catch (error) {
      console.log(error);
      setLoadingUser(false);
    }
  }

  const handleDeleteExperience = (index: number) => {
    if (experiences) {
      const deletedExperiences = experiences.filter((_, i) => i !== index);
      //updateExperiences(deletedExperiences);
      setExperiences(deletedExperiences);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setExperiences(experiences);
  }, [experiences]);

  const handleSubmitExperiences = async () => {
    setLoading(true);
    try {
      if (experiences) {
        await updateExperiences(experiences, CVFile, contact);
        setContent('Experiences updated!');
        setShow(true);
      }
    } catch (error) {
      console.error('Failed to update experiences', error);
      setContent('Failed to update experiences', 'warning');
      setShow(true);
    } finally {
      setLoading(false);
    }
  };

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

  const RemoveFile = async () => {
    if (typeof CVFile === 'string') {
      const id = Utils.encodeImageId(CVFile);
      if (id) await deleteFile(id);
      setCVFile(undefined);
      setFileName('Add CV');
    } else {
      setCVFile(undefined);
      setFileName('Add CV');
    }
  };

  return (
    <div className="w-full px-12 pt-12 bg-white bg-opacity-10 rounded-2xl flex-col justify-start items-start gap-12 inline-flex">
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="w-full justify-start items-center gap-2 inline-flex">
          <Icon.CV size="24" />
          <Typography.H2>Career</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Add your CV and past experiences to get noticed
        </Typography.Body>
        <Button.Transparent
          className="-mt-4 w-auto"
          onClick={() => {
            setExperienceToEdit(null);
            setExperienceIndexToEdit(null);
            setShowModalCareer(true);
          }}
        >
          Add experience
        </Button.Transparent>
        {loadingUser ? (
          <Skeleton.Simple />
        ) : (
          <>
            <div className="w-full flex justify-between gap-4">
              <div className="w-full">
                <Input.Label value="Add CV" />
                <Input.UploadFile
                  required
                  accept=".pdf"
                  fileName={
                    fileName && fileName.length > 15
                      ? fileName.substring(0, 15) + '...'
                      : fileName
                  }
                  className="mt-1 h-[20px]"
                  id="file_input"
                  onChange={UploadCVFile}
                />
                {CVFile && (
                  <div className="flex gap-2 mt-1 ml-2">
                    {typeof CVFile === 'string' && (
                      <Typography.Body
                        variant="small"
                        className="cursor-pointer text-opacity-50 hover:text-opacity-80"
                        onClick={() => {
                          window.open(CVFile);
                        }}
                      >
                        View file
                      </Typography.Body>
                    )}
                    <Typography.Body
                      variant="small"
                      className="cursor-pointer text-red-500 text-opacity-50  hover:text-opacity-80"
                      onClick={RemoveFile}
                    >
                      Remove file
                    </Typography.Body>
                  </div>
                )}
              </div>
              <div className="w-full">
                <Input.Label value="Add contact" />
                <Input.Text
                  placeholder={'Add contact'}
                  defaultValue={contact}
                  className="mt-1 h-[20px]"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setContact(e.target.value)
                  }
                />
              </div>
            </div>
            <div className="w-full mt-4">
              {sortedExperiences && sortedExperiences.length > 0 ? (
                sortedExperiences.map((experience, index) => (
                  <div
                    key={index}
                    className="relative w-full flex flex-col gap-4"
                  >
                    <div className="items-center absolute top-2 right-2 flex gap-1">
                      <div
                        onClick={() => {
                          setExperienceToEdit(experience);
                          setExperienceIndexToEdit(index);
                          setShowModalCareer(true);
                        }}
                        className="rounded-full hover:bg-white hover:bg-opacity-10 p-2 cursor-pointer"
                      >
                        <Icon.Pencil size="16" />
                      </div>
                      <div
                        onClick={() => handleDeleteExperience(index)}
                        className="rounded-full hover:bg-white hover:bg-opacity-10 p-2 cursor-pointer"
                      >
                        <Icon.Trash size="16" />
                      </div>
                    </div>
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
                        {experience.startDate.month} {experience.startDate.year}{' '}
                        -{' '}
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
                    {index < sortedExperiences.length - 1 && (
                      <Content.Divider />
                    )}
                  </div>
                ))
              ) : (
                <Typography.Body variant="medium" className="text-opacity-50">
                  No experience yet
                </Typography.Body>
              )}
            </div>
            <div className="w-full flex justify-end">
              <Button.Large
                icon={<Icon.Check size="16" />}
                className="w-auto h-[40px]"
                onClick={handleSubmitExperiences}
                loading={loading}
              >
                Save
              </Button.Large>
            </div>
          </>
        )}
      </div>
      <Modal.Career
        showModal={showModalCareer}
        setShowModal={setShowModalCareer}
        setExperiences={setExperiences}
        experienceToEdit={experienceToEdit}
        experienceIndexToEdit={experienceIndexToEdit}
        setExperienceToEdit={setExperienceToEdit}
      />
    </div>
  );
}
