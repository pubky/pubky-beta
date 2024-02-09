'use client';

type SwitchProps = {
  disable?: boolean;
};

import React from 'react';
export const Switch = ({ disable = false }: SwitchProps) => {
  const [checked, setChecked] = React.useState(false);

  const toggleSwitch = () => {
    if (!disable) {
      setChecked(!checked);
    }
  };

  const switchStyles = `
      .switch-container {
        display: flex;
        align-items: center;
      }
  
      .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
        border-radius: 34px;
        overflow: hidden;
      }
  
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
  
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #3A3A3C;
        transition: .4s;
        border-radius: 34px;
      }
  
      .slider:before {
        position: absolute;
        content: "";
        height: 24px;
        width: 24px;
        left: 4px;
        bottom: 4px;
        background-color: ${disable ? `gray` : `white`};
        transition: .4s;
        border-radius: 50%;
      }
  
      input:checked + .slider {
      //border: 1px solid red;
       background: conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.2) 0deg, rgba(0, 255, 93, 0.2) 118.12deg, rgba(0, 75, 255, 0.2) 238.12deg, rgba(253, 0, 255, 0.2) 360deg)
       
    }

  
      input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
      }
  
      input:checked + .slider:before {
        transform: translateX(26px);
      }
    `;

  return (
    <div>
      <style>{switchStyles}</style>
      <div className="switch-container">
        <label className="switch">
          <input type="checkbox" checked={checked} onChange={toggleSwitch} />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};
