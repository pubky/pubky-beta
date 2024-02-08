type IconProps = {
  size?: string;
  color?: string;
};

export const ArrowUp = ({ size = '16', color = 'white' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8 2C8.27614 2 8.5 2.22386 8.5 2.5V13.5C8.5 13.7761 8.27614 14 8 14C7.72386 14 7.5 13.7761 7.5 13.5V2.5C7.5 2.22386 7.72386 2 8 2Z"
      fill={color}
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.64645 2.14645C7.84171 1.95118 8.15829 1.95118 8.35355 2.14645L12.8536 6.64645C13.0488 6.84171 13.0488 7.15829 12.8536 7.35355C12.6583 7.54882 12.3417 7.54882 12.1464 7.35355L8 3.20711L3.85355 7.35355C3.65829 7.54882 3.34171 7.54882 3.14645 7.35355C2.95118 7.15829 2.95118 6.84171 3.14645 6.64645L7.64645 2.14645Z"
      fill={color}
    />
  </svg>
);
