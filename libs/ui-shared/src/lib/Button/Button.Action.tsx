type ActionButtonProps = {
  svg: React.ReactNode;
  type?: string;
  label?: string;
  number?: number;
  backgroundColorDefault?: string;
  backgroundColorDefaultHover?: string;
  backgroundColorSelected?: string;
  borderColorSelected?: string;
  sizeSmallButton?: string;
};

export const Action = ({
  svg,
  type = 'default',
  label,
  number,
  backgroundColorDefault = 'rgba(255, 255, 255, 0.1)',
  backgroundColorDefaultHover = 'rgba(255, 255, 255, 0.16)',
  backgroundColorSelected = 'conic-gradient(from -45deg at 50% 50%, rgb(253, 0, 255, 0.2) 0deg, rgb(0, 255, 93, 0.2) 118.12deg, rgb(0, 75, 255, 0.2) 238.12deg, rgb(253, 0, 255, 0.2) 360deg), conic-gradient(from -45deg at 50% 50%, rgb(253, 0, 255, 0.2) 0deg, rgb(0, 255, 93, 0.2) 118.12deg, rgb(0, 75, 255, 0.2) 238.12deg, rgb(253, 0, 255, 0.2) 360deg)',
  borderColorSelected = '#FD00FF',
  sizeSmallButton = '32px',
}: ActionButtonProps) => {
  function getButtonStyle(type: string) {
    switch (type) {
      case 'post':
        return {
          width: '44px',
          height: '32px',
          padding: '8px',
          gap: '4px',
          borderRadius: '32px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
          },
        };
      case 'small':
        return {
          width: sizeSmallButton,
          height: sizeSmallButton,
          borderRadius: sizeSmallButton,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
          },
        };
      case 'selected':
        return {
          width: '48px',
          height: '48px',
          borderRadius: '48px',
          background: backgroundColorSelected,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: '1px, 0px, 0px, 0px',
          borderTop: '1px solid',
          borderColor: borderColorSelected,
        };
      default:
        return {
          width: '48px',
          height: '48px',
          borderRadius: '48px',
          backgroundColor: backgroundColorDefault,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&hover': {
            backgroundColor: backgroundColorDefaultHover,
          },
        };
    }
  }

  const buttonStyleButton = getButtonStyle(type);

  const buttonStyle = buttonStyleButton;

  return (
    <>
      <button style={buttonStyle}>
        {svg}
        {number && (
          <span className="text-center text-[#FFFFFF80] font-semibold text-[13px] leading-[13px] tracking-[0.2px]">
            {number}
          </span>
        )}
      </button>
      {label && (
        <span className="text-white font-semibold text-[13px] leading-[13px] tracking-[0.2px] py-1 px-2">
          {label}
        </span>
      )}
    </>
  );
};
