'use client';

import { useState, useEffect } from 'react';
import { Check } from '../Icon/Icon.System';

type Option = {
  label?: string;
  value: string;
};

type RadioProps = {
  options: Option[];
};

export const Radio = ({ options }: RadioProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    if (options.length > 0) {
      setSelectedOption(options[0].value);
    }
  }, [options]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="inline-grid gap-8">
      {options.map((option: Option, index: number) => (
        <label key={index} className="inline-block">
          <span className="text-white mr-2">{option.label}</span>
          <span className="relative inline-block w-5 h-5">
            <input
              type="radio"
              value={option.value}
              checked={selectedOption === option.value}
              onChange={handleOptionChange}
              className="absolute opacity-0 top-0 left-0"
            />
            {selectedOption === option.value && <Check />}
          </span>
        </label>
      ))}
    </div>
  );
};
