'use client';

import { useState, useEffect } from 'react';
import { Check } from '../Icon/Icon.System';

type Option = {
  label: string;
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

  const radioContainer = {
    gap: '20px',
    display: 'flex',
  };

  const radioStyles = `
  .radio-custom {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
  }
  
  .radio-input {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
  }
  
  .radio-label {
    display: inline-block;
    margin-right: 10px;
  }
`;

  return (
    <div>
      <style>{radioStyles}</style>
      <div style={radioContainer}>
        {options.map((option: Option, index: number) => (
          <label key={index} className="radio-label">
            <span className="text-white mr-2">{option.label}</span>
            <span className="radio-custom">
              <input
                type="radio"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={handleOptionChange}
                className="radio-input"
              />
              {selectedOption === option.value && <Check />}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
