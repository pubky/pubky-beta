interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
  color?: string;
}

export const Plus = ({ size = '16', color = 'white' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 8C2 7.72386 2.22386 7.5 2.5 7.5H13.5C13.7761 7.5 14 7.72386 14 8C14 8.27614 13.7761 8.5 13.5 8.5H2.5C2.22386 8.5 2 8.27614 2 8Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2C8.27614 2 8.5 2.22386 8.5 2.5V13.5C8.5 13.7761 8.27614 14 8 14C7.72386 14 7.5 13.7761 7.5 13.5V2.5C7.5 2.22386 7.72386 2 8 2Z"
      fill={color}
    />
  </svg>
);

export const Minus = ({ size = '16', color = 'white' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 8C2 7.72386 2.22386 7.5 2.5 7.5L13.5 7.5C13.7761 7.5 14 7.72386 14 8C14 8.27614 13.7761 8.5 13.5 8.5H2.5C2.22386 8.5 2 8.27614 2 8Z"
      fill={color}
    />
  </svg>
);

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
