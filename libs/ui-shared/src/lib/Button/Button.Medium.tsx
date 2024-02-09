type MediumButtonProps = {
  title: string;
  svg?: React.ReactNode;
  state?: string;
  width?: string;
};

export const Medium = ({
  title,
  svg,
  state = 'default',
  width = '100%',
}: MediumButtonProps) => {
  function getBackground(state: string) {
    switch (state) {
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
    '&hover': {
      ...(state === 'default' && {
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
      }),
    },
  };

  const wrapper = {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  };

  return (
    <button style={buttonStyle}>
      <div style={wrapper}>
        {svg}
        <p className="center font-semibold text-[15px] leading-[18px] tracking-[0.2px]">
          {title}
        </p>
      </div>
    </button>
  );
};
