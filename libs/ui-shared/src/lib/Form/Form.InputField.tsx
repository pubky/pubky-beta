import { CSSProperties } from 'react';

type InputFieldProps = {
  value?: string;
  placeHolder?: string;
  label?: string;
};

export const InputField = ({ value, placeHolder, label }: InputFieldProps) => {
  const inputStyle = {
    width: '384px',
    height: '70px',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #FFFFFF14',
    background: '#FFFFFF14',
    boxShadow: '0px 4px 8px 0px #00000052 inset',
    outline: 'none',
    fontSize: '17px',
    fontWeight: 400,
    lineHeight: '22px',
    letterSpacing: '0.4px',
    color: '#FFFFFFCC',
  };

  const wrapper = {
    display: 'grid',
    gap: '8px',
  };

  const labelStyle: CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: '1px',
    color: '#FFFFFF52',
    textTransform: 'uppercase',
  };

  return (
    <div style={wrapper}>
      <span style={labelStyle}>{label}</span>
      <input placeholder={placeHolder} style={inputStyle} value={value} />
    </div>
  );
};
