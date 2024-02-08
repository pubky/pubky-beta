import React from 'react';

interface TagButtonProps {
  title: string;
  svg?: React.ReactNode;
  state?: string;
  width?: string;
}

export const TagButton = ({
  title,
  svg,
  state = 'default',
  width = '100%',
}: TagButtonProps) => {
  function getBackground(state: string) {
    switch (state) {
      case 'active':
        return 'rgba(255, 255, 255, 0.16)';
      case 'border':
        return 'transparent';
      case 'no-border':
        return 'transparent';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }

  const background = getBackground(state);
  const border =
    state === 'border'
      ? '1px solid white'
      : state === 'no-border'
      ? 'none'
      : 'none';

  const buttonStyle = {
    width: width,
    padding: '15px 24px',
    borderRadius: '54px',
    gap: '8px',
    backgroundColor: background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: border,
  };

  return (
    <button style={buttonStyle}>
      <p className="flex center font-semibold text-[15px] leading-[18px] tracking-[0.2px]">
        {svg}
        <span className="ml-[6px]">{title}</span>
      </p>
    </button>
  );
};
