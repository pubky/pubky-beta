type IconProps = {
  size?: string;
  color?: string;
};

export const X = ({ size = '16', color = 'white' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.32">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.14645 3.14645C2.95118 3.34171 2.95118 3.65829 3.14645 3.85355L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L3.85355 3.14645C3.65829 2.95118 3.34171 2.95118 3.14645 3.14645Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.8536 3.14645C12.6583 2.95118 12.3417 2.95118 12.1464 3.14645L3.14645 12.1464C2.95118 12.3417 2.95118 12.6583 3.14645 12.8536C3.34171 13.0488 3.65829 13.0488 3.85355 12.8536L12.8536 3.85355C13.0488 3.65829 13.0488 3.34171 12.8536 3.14645Z"
        fill={color}
      />
    </g>
  </svg>
);
