type CursorProps = {
  value?: string;
  placeHolder?: string;
};

export const Cursor = ({ value, placeHolder }: CursorProps) => {
  const inputStyle = {
    width: '384px',
    height: '70px',
    padding: '24px',
    background: 'transparent',
    outline: 'none',
    fontSize: '17px',
    fontWeight: 400,
    lineHeight: '22px',
    letterSpacing: '0.4px',
    color: '#FFFFFFCC',
  };

  return <input placeholder={placeHolder} style={inputStyle} value={value} />;
};
