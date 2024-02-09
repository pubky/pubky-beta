import { GridFour } from '../Icon/Icon.Design';
import { X } from '../Icon/Icon.Math';
import { MagnifyingGlass } from '../Icon/Icon.System';

type InputFieldProps = {
  value?: string;
  placeHolder?: string;
  width?: string;
  tags?: string[];
};

export const Search = ({
  width = '100%',
  value,
  placeHolder,
  tags,
}: InputFieldProps) => {

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: width,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '48px',
    padding: '24px',
    borderRadius: '48px',
    border: '1px solid #FFFFFF29',
    background:
      'linear-gradient(0deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16)), linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.08) 100%)',
    outline: 'none',
    fontSize: '15px',
    fontWeight: 600,
    lineHeight: '18px',
    letterSpacing: '0.2px',
    color: 'white',
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    right: '16px',
    transform: 'translateY(-50%)',
    display: "flex",
    gap: "8px"
  };

  const tagsContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '24px',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const tagStyle = (backgroundColor: string): React.CSSProperties => ({
    backgroundColor: backgroundColor,
    padding: '4px 8px',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  });

  return (
    <div style={inputContainerStyle}>
      {tags && (
        <div style={tagsContainerStyle}>
          {tags.map((tag, index) => (
            <span style={tagStyle(getRandomColor())} key={index}>
              {tag}
              {<X />}
            </span>
          ))}
        </div>
      )}
      <input
        placeholder={tags ? '' : placeHolder}
        style={inputStyle}
        value={tags ? '' : value}
      />
      <div style={iconStyle}>
        {tags && <GridFour />}
        <MagnifyingGlass />
      </div>
    </div>
  );
};
