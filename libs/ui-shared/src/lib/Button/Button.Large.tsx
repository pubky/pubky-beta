type LargeButtonProps = {
  title: string;
  type?: string;
  svg?: React.ReactNode;
  state?: string;
  width?: string;
};

export const LargeButton = ({
  title,
  type = 'primary',
  svg,
  state = 'default',
  width = '100%',
}: LargeButtonProps) => {
  let gradient, gradient1, gradient2, gradient3, gradient4;

  function getGradientPrimaryButton(state: string) {
    switch (state) {
      case 'active':
        return ['0.5', '0.5', '0.5', '0.8'];
      case 'disable':
        return ['0.1', '0.1', '0.1', '0.3'];
      default:
        return ['0.2', '0.2', '0.2', '0.6'];
    }
  }

  function getGradientSecondaryButton(state: string) {
    switch (state) {
      case 'active':
        return ['0.32'];
      default:
        return ['0.16'];
    }
  }

  if (type === 'secondary') {
    [gradient] = getGradientSecondaryButton(state);
  } else {
    [gradient1, gradient2, gradient3, gradient4] =
      getGradientPrimaryButton(state);
  }

  const buttonStylePrimary = {
    width: width,
    height: '56px',
    padding: '20px 24px',
    borderRadius: '64px',
    border: '2px solid',
    gap: '40px',
    background: `
      conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, ${gradient1}) 0deg, rgba(0, 255, 93, ${gradient2}) 118.12deg, rgba(0, 75, 255, ${gradient3}) 238.12deg, rgba(253, 0, 255, ${gradient1}) 360deg),
      conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, ${gradient1}) 0deg, rgba(0, 255, 93, ${gradient2}) 118.12deg, rgba(0, 75, 255, ${gradient3}) 238.12deg, rgba(253, 0, 255, ${gradient1}) 360deg)
    `,
    boxShadow: '0px 25px 50px 0px rgba(0, 0, 0, 0.25)',
    borderImage: `conic-gradient(from -45deg at 50% 50%, 
        rgba(253, 0, 255, ${gradient4}) 0deg, 
        rgba(0, 255, 93, ${gradient4}) 118.12deg, 
        rgba(0, 75, 255, ${gradient4}) 238.12deg, 
        rgba(253, 0, 255, ${gradient4}) 360deg
      )`,
    borderImageSlice: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '24px',
  };

  const buttonStyleSecondary = {
    width: width,
    padding: '20px 24px',
    borderRadius: '64px',
    gap: '40px',
    backgroundColor: `rgba(255, 255, 255, ${gradient})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  return (
    <button
      style={type === 'secondary' ? buttonStyleSecondary : buttonStylePrimary}
    >
      <p className="flex center font-semibold text-[15px] leading-[18px] tracking-[0.2px]">
        {svg}
        <span className="ml-[6px]">{title}</span>
      </p>
    </button>
  );
};
