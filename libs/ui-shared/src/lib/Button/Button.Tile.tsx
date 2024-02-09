type TileButtonProps = {
  title: string;
  svg?: React.ReactNode;
  width?: string;
};

export const Tile = ({ title, svg, width = '100%' }: TileButtonProps) => {
  const buttonStyle = {
    width: width,
    height: '66px',
    padding: '24px',
    borderRadius: '16px',
    border: '2px dashed rgba(255, 255, 255, 0.16)',
    gap: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
    '&:hover': {
      background: `
        conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.2) 0deg, rgba(0, 255, 93, 0.2) 118.12deg, rgba(0, 75, 255, 0.2) 238.12deg, rgba(253, 0, 255, 0.2) 360deg),
        conic-gradient(from -45deg at 50% 50%, rgba(253, 0, 255, 0.2) 0deg, rgba(0, 255, 93, 0.2) 118.12deg, rgba(0, 75, 255, 0.2) 238.12deg, rgba(253, 0, 255, 0.2) 360deg)
      `,
      borderImage: `conic-gradient(from -45deg at 50% 50%, 
        rgba(253, 0, 255, 0.6) 0deg, 
        rgba(0, 255, 93, 0.6) 118.12deg, 
        rgba(0, 75, 255, 0.6) 238.12deg, 
        rgba(253, 0, 255, 0.6) 360deg
      )`,
      borderImageSlice: '1',
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
