'use client';

import { useState } from 'react';
import { Check } from '../Icon/Icon.System';

export const CheckBox = () => {
  const [checked, setChecked] = useState(false);

  const toggleCheckBox = () => {
    setChecked(!checked);
  };

  const checkBoxStyles = `
    .checkbox-container {
      display: flex;
      align-items: center;
      font-family: Arial, sans-serif;
    }
    
    .checkbox input {
      opacity: 0;
      position: absolute;
    }
    
    .checkmark {
      display: inline-block;
      width: 32px;
      height: 32px;
      background-color: #eee;
      border: 1px solid #FFFFFF52;
      border-radius: 8px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .checkbox input:checked + .checkmark {
      background: conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.2) 0deg, rgba(0, 255, 93, 0.2) 118.12deg, rgba(0, 75, 255, 0.2) 238.12deg, rgba(253, 0, 255, 0.2) 360deg);
      //border: 1px solid red; {/** Add border color*/}
    }
    
    .checkbox {
      font-size: 16px;
      cursor: pointer;
    }
    
    .checkbox .checkmark {
      background-color: #FFFFFF1A;
    }
  `;

  return (
    <div>
      <style>{checkBoxStyles}</style>
      <div className="checkbox-container">
        <label className="checkbox">
          <input type="checkbox" checked={checked} onChange={toggleCheckBox} />
          <span className="checkmark">
            {checked && (
              <Check size="22"/>
            )}
          </span>
        </label>
      </div>
    </div>
  );
};
