import React from 'react';
import { PensilIcon } from '../../../../../apps/web/app/svg';

export const CreateButton = () => {
  const buttonStyle = {
    width: '96px',
    height: '96px',
    border: '12px solid',
    // borderRadius: '96px',
    borderImage: `conic-gradient(from -45deg at 50% 50%, 
        rgba(253, 0, 255) 0deg, 
        rgba(0, 255, 93) 118.12deg, 
        rgba(0, 75, 255) 238.12deg, 
        rgba(253, 0, 255) 360deg
      )`,
    borderImageSlice: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      background: `
        conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.2) 0deg, rgba(0, 255, 93, 0.2) 118.12deg, rgba(0, 75, 255, 0.2) 238.12deg, rgba(253, 0, 255, 0.2) 360deg),
        conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.2) 0deg, rgba(0, 255, 93, 0.2) 118.12deg, rgba(0, 75, 255, 0.2) 238.12deg, rgba(253, 0, 255, 0.2) 360deg)
      `,
    },
  };

  const pencilStyle = {
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'rotate(20deg)',
    },
  };

  return (
    <button style={buttonStyle}>
      <div style={pencilStyle}>
        <PensilIcon />
      </div>
    </button>
  );
};
