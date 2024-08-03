'use client';

import { IExperience } from '@/types';
import { Input, Modal } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';

interface CareerProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setExperiences: React.Dispatch<
    React.SetStateAction<IExperience[] | undefined>
  >;
  experienceToEdit: IExperience | null;
  experienceIndexToEdit: number | null;
  setExperienceToEdit: React.Dispatch<React.SetStateAction<IExperience | null>>;
}

const EmploymentType = [
  'Full time',
  'Part time',
  'Self-employed',
  'Freelance',
  'Contract',
  'Internship',
  'Apprenticeship',
  'Seasonal',
];

const LocationType = ['On-site', 'Hybrid', 'Remote'];

const Months = [
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

const Years = [
  '1924',
  '1925',
  '1926',
  '1927',
  '1928',
  '1929',
  '1930',
  '1931',
  '1932',
  '1933',
  '1934',
  '1935',
  '1936',
  '1937',
  '1938',
  '1939',
  '1940',
  '1941',
  '1942',
  '1943',
  '1944',
  '1945',
  '1946',
  '1947',
  '1948',
  '1949',
  '1950',
  '1951',
  '1952',
  '1953',
  '1954',
  '1955',
  '1956',
  '1957',
  '1958',
  '1959',
  '1960',
  '1961',
  '1962',
  '1963',
  '1964',
  '1965',
  '1966',
  '1967',
  '1968',
  '1969',
  '1970',
  '1971',
  '1972',
  '1973',
  '1974',
  '1975',
  '1976',
  '1977',
  '1978',
  '1979',
  '1980',
  '1981',
  '1982',
  '1983',
  '1984',
  '1985',
  '1986',
  '1987',
  '1988',
  '1989',
  '1990',
  '1991',
  '1992',
  '1993',
  '1994',
  '1995',
  '1996',
  '1997',
  '1998',
  '1999',
  '2000',
  '2001',
  '2002',
  '2003',
  '2004',
  '2005',
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
];

export default function Career({
  showModal,
  setShowModal,
  setExperiences,
  experienceToEdit,
  experienceIndexToEdit,
  setExperienceToEdit,
}: CareerProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [selectedOptionEmployment, setSelectedOptionEmployment] = useState('');
  const [selectedOptionLocation, setSelectedOptionLocation] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endYear, setEndYear] = useState('');
  const [description, setDescription] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const disabled =
    !title ||
    !company ||
    !location ||
    !selectedOptionEmployment ||
    !selectedOptionLocation ||
    !startMonth ||
    !startYear ||
    !description;

  const handleCheckboxChange = (newCheckedState: boolean) => {
    setIsChecked(newCheckedState);
  };

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
        setExperienceToEdit(null);
        resetFormFields();
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalRef, setShowModal, setExperienceToEdit]);

  const handleAddExperience = () => {
    const experience = {
      title,
      employmentType: selectedOptionEmployment,
      companyName: company,
      location,
      locationType: selectedOptionLocation,
      currentlyWorking: isChecked,
      startDate: {
        month: startMonth,
        year: startYear,
      },
      endDate: isChecked
        ? {
            month: 'Present',
            year: 'Present',
          }
        : {
            month: endMonth,
            year: endYear,
          },
      description,
    };

    setExperiences((prevExperiences) => {
      if (experienceIndexToEdit !== null && prevExperiences) {
        const updatedExperiences = [...prevExperiences];
        updatedExperiences[experienceIndexToEdit] = experience;
        return updatedExperiences;
      }
      return [...(prevExperiences || []), experience];
    });

    setShowModal(false);
    setExperienceToEdit(null);
    resetFormFields();
  };

  const resetFormFields = () => {
    setTitle('');
    setCompany('');
    setLocation('');
    setSelectedOptionEmployment('');
    setSelectedOptionLocation('');
    setStartMonth('');
    setStartYear('');
    setEndMonth('');
    setEndYear('');
    setDescription('');
    setIsChecked(false);
  };

  useEffect(() => {
    if (experienceToEdit) {
      setTitle(experienceToEdit.title);
      setCompany(experienceToEdit.companyName);
      setLocation(experienceToEdit.location);
      setSelectedOptionEmployment(experienceToEdit.employmentType);
      setSelectedOptionLocation(experienceToEdit.locationType);
      setStartMonth(experienceToEdit.startDate.month);
      setStartYear(experienceToEdit.startDate.year);
      if (experienceToEdit.currentlyWorking) {
        setIsChecked(true);
      } else {
        setEndMonth(experienceToEdit.endDate.month);
        setEndYear(experienceToEdit.endDate.year);
      }
      setDescription(experienceToEdit.description);
    }
  }, [experienceToEdit]);

  return (
    <Modal.Root
      show={showModal}
      closeModal={() => {
        setShowModal(false);
        setExperienceToEdit(null);
        resetFormFields();
      }}
      modalRef={modalRef}
      className="w-[792px] max-h-[650px] overflow-y-auto justify-start"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Add Experience" />
      <div className="flex flex-col gap-4 mt-3">
        <div>
          <Input.Label value="Title" />
          <Input.Text
            placeholder={'Ex: Retail Sales Manager'}
            className="mt-1 h-[20px]"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            value={title}
          />
        </div>
        <div>
          <Input.Label value="Employment type" />
          <Input.TextMenu
            options={EmploymentType}
            className="mt-1 h-[20px]"
            value={selectedOptionEmployment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedOptionEmployment(e.target.value)
            }
            placeholder="Please select"
          />
        </div>
        <div>
          <Input.Label value="Company name" />
          <Input.Text
            placeholder={'Ex: Tether'}
            className="mt-1 h-[20px]"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCompany(e.target.value)
            }
            value={company}
          />
        </div>
        <div>
          <Input.Label value="Location" />
          <Input.Text
            placeholder={'Ex: London, UK'}
            className="mt-1 h-[20px]"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocation(e.target.value)
            }
            value={location}
          />
        </div>
        <div>
          <Input.Label value="Location type" />
          <Input.TextMenu
            options={LocationType}
            className="mt-1 h-[20px]"
            value={selectedOptionLocation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedOptionLocation(e.target.value)
            }
            placeholder="Please select"
          />
        </div>
        <Input.Checkbox
          checked={isChecked}
          onCheckChange={handleCheckboxChange}
          text="I am currently working in this role"
        />
        <div>
          <Input.Label value="Start date" />
          <div className="w-full flex gap-2 justify-between">
            <Input.TextMenu
              options={Months}
              className="mt-1 h-[20px]"
              value={startMonth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStartMonth(e.target.value)
              }
              placeholder="Month"
            />
            <Input.TextMenu
              options={Years}
              className="mt-1 h-[20px]"
              value={startYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStartYear(e.target.value)
              }
              placeholder="Year"
            />
          </div>
        </div>
        <div>
          <Input.Label value="End date" />
          <div className="w-full flex gap-2 justify-between">
            <Input.TextMenu
              options={Months}
              disabled={isChecked}
              className="mt-1 h-[20px]"
              value={endMonth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEndMonth(e.target.value)
              }
              placeholder="Month"
            />
            <Input.TextMenu
              options={Years}
              disabled={isChecked}
              className="mt-1 h-[20px]"
              value={endYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEndYear(e.target.value)
              }
              placeholder="Year"
            />
          </div>
        </div>
        <div>
          <Input.Label value="Description" />
          <div className="p-8 rounded-2xl bg-transparent border border-white border-opacity-30 border-dashed mt-1">
            <Input.TextArea
              placeholder="Add description"
              defaultValue={description}
              maxLength={160}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
            />
          </div>
        </div>
      </div>
      <Modal.SubmitAction
        disabled={disabled}
        className="w-auto mt-8"
        onClick={() => !disabled && handleAddExperience()}
      >
        {experienceToEdit ? 'Update Experience' : 'Add Experience'}
      </Modal.SubmitAction>
    </Modal.Root>
  );
}
