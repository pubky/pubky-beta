interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
  color?: string;
}

export const ArrowUp = ({ size = '16', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2C8.27614 2 8.5 2.22386 8.5 2.5V13.5C8.5 13.7761 8.27614 14 8 14C7.72386 14 7.5 13.7761 7.5 13.5V2.5C7.5 2.22386 7.72386 2 8 2Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.64645 2.14645C7.84171 1.95118 8.15829 1.95118 8.35355 2.14645L12.8536 6.64645C13.0488 6.84171 13.0488 7.15829 12.8536 7.35355C12.6583 7.54882 12.3417 7.54882 12.1464 7.35355L8 3.20711L3.85355 7.35355C3.65829 7.54882 3.34171 7.54882 3.14645 7.35355C2.95118 7.15829 2.95118 6.84171 3.14645 6.64645L7.64645 2.14645Z"
      fill={color}
    />
  </svg>
);

export const DropdownIcon = ({ size = '24', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.2803 7.71967C19.5732 8.01256 19.5732 8.48744 19.2803 8.78033L12.5303 15.5303C12.2374 15.8232 11.7626 15.8232 11.4697 15.5303L4.71967 8.78033C4.42678 8.48744 4.42678 8.01256 4.71967 7.71967C5.01256 7.42678 5.48744 7.42678 5.78033 7.71967L12 13.9393L18.2197 7.71967C18.5126 7.42678 18.9874 7.42678 19.2803 7.71967Z"
      fill={color}
    />
  </svg>
);

export const ArrowUpRight = ({ size = '16', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.3536 3.64645C12.5488 3.84171 12.5488 4.15829 12.3536 4.35355L4.35355 12.3536C4.15829 12.5488 3.84171 12.5488 3.64645 12.3536C3.45118 12.1583 3.45118 11.8417 3.64645 11.6464L11.6464 3.64645C11.8417 3.45118 12.1583 3.45118 12.3536 3.64645Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 4C5 3.72386 5.22386 3.5 5.5 3.5H12C12.2761 3.5 12.5 3.72386 12.5 4V10.5C12.5 10.7761 12.2761 11 12 11C11.7239 11 11.5 10.7761 11.5 10.5V4.5H5.5C5.22386 4.5 5 4.27614 5 4Z"
      fill={color}
    />
  </svg>
);

export const Repost = ({ size = '16', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.64645 9.14645C8.84171 8.95118 9.15829 8.95118 9.35355 9.14645L12 11.7929L14.6464 9.14645C14.8417 8.95118 15.1583 8.95118 15.3536 9.14645C15.5488 9.34171 15.5488 9.65829 15.3536 9.85355L12.3536 12.8536C12.1583 13.0488 11.8417 13.0488 11.6464 12.8536L8.64645 9.85355C8.45118 9.65829 8.45118 9.34171 8.64645 9.14645Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 3.5C8 3.22386 8.22386 3 8.5 3H12C12.2761 3 12.5 3.22386 12.5 3.5V12.5C12.5 12.7761 12.2761 13 12 13C11.7239 13 11.5 12.7761 11.5 12.5V4H8.5C8.22386 4 8 3.77614 8 3.5Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.35355 6.85355C7.15829 7.04882 6.84171 7.04882 6.64645 6.85355L4 4.20711L1.35355 6.85355C1.15829 7.04882 0.841709 7.04881 0.646447 6.85355C0.451184 6.65829 0.451184 6.34171 0.646447 6.14645L3.64645 3.14645C3.84171 2.95118 4.15829 2.95118 4.35355 3.14645L7.35355 6.14645C7.54882 6.34171 7.54882 6.65829 7.35355 6.85355Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 12.5C8 12.7761 7.77614 13 7.5 13L4 13C3.72386 13 3.5 12.7761 3.5 12.5L3.5 3.5C3.5 3.22386 3.72386 3 4 3C4.27614 3 4.5 3.22386 4.5 3.5L4.5 12L7.5 12C7.77614 12 8 12.2239 8 12.5Z"
      fill={color}
    />
  </svg>
);

export const ArrowLeft = ({ size = '16', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 8C2 7.72386 2.22386 7.5 2.5 7.5H13.5C13.7761 7.5 14 7.72386 14 8C14 8.27614 13.7761 8.5 13.5 8.5H2.5C2.22386 8.5 2 8.27614 2 8Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.35355 3.14645C7.54882 3.34171 7.54882 3.65829 7.35355 3.85355L3.20711 8L7.35355 12.1464C7.54882 12.3417 7.54882 12.6583 7.35355 12.8536C7.15829 13.0488 6.84171 13.0488 6.64645 12.8536L2.14645 8.35355C1.95118 8.15829 1.95118 7.84171 2.14645 7.64645L6.64645 3.14645C6.84171 2.95118 7.15829 2.95118 7.35355 3.14645Z"
      fill={color}
    />
  </svg>
);

export const ArrowRight = ({ size = '16', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 8C2 7.72386 2.22386 7.5 2.5 7.5H13.5C13.7761 7.5 14 7.72386 14 8C14 8.27614 13.7761 8.5 13.5 8.5H2.5C2.22386 8.5 2 8.27614 2 8Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.64645 3.14645C8.84171 2.95118 9.15829 2.95118 9.35355 3.14645L13.8536 7.64645C14.0488 7.84171 14.0488 8.15829 13.8536 8.35355L9.35355 12.8536C9.15829 13.0488 8.84171 13.0488 8.64645 12.8536C8.45118 12.6583 8.45118 12.3417 8.64645 12.1464L12.7929 8L8.64645 3.85355C8.45118 3.65829 8.45118 3.34171 8.64645 3.14645Z"
      fill={color}
    />
  </svg>
);

export const CaretRight = ({ size = '32', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.2" d="M12 6L22 16L12 26V6Z" fill={color} />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.6173 5.07612C11.991 4.92134 12.4211 5.00689 12.7071 5.29289L22.7071 15.2929C23.0976 15.6834 23.0976 16.3166 22.7071 16.7071L12.7071 26.7071C12.4211 26.9931 11.991 27.0787 11.6173 26.9239C11.2436 26.7691 11 26.4045 11 26V6C11 5.59554 11.2436 5.2309 11.6173 5.07612ZM13 8.41421V23.5858L20.5858 16L13 8.41421Z"
      fill={color}
    />
  </svg>
);

export const CaretLeft = ({ size = '32', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.2" d="M20 26L10 16L20 6V26Z" fill={color} />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.3827 5.07612C20.7564 5.2309 21 5.59554 21 6V26C21 26.4045 20.7564 26.7691 20.3827 26.9239C20.009 27.0787 19.5789 26.9931 19.2929 26.7071L9.29289 16.7071C8.90237 16.3166 8.90237 15.6834 9.29289 15.2929L19.2929 5.29289C19.5789 5.00689 20.009 4.92134 20.3827 5.07612ZM11.4142 16L19 23.5858V8.41421L11.4142 16Z"
      fill={color}
    />
  </svg>
);

export const CaretUp = ({ size = '32', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.2" d="M6 20L16 10L26 20H6Z" fill={color} />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.2929 9.29289C15.6834 8.90237 16.3166 8.90237 16.7071 9.29289L26.7071 19.2929C26.9931 19.5789 27.0787 20.009 26.9239 20.3827C26.7691 20.7564 26.4045 21 26 21H6.00003C5.59557 21 5.23093 20.7564 5.07615 20.3827C4.92137 20.009 5.00692 19.5789 5.29292 19.2929L15.2929 9.29289ZM8.41424 19H23.5858L16 11.4142L8.41424 19Z"
      fill={color}
    />
  </svg>
);

export const Next = ({ size = '32', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.2929 6.29289C11.6834 5.90237 12.3166 5.90237 12.7071 6.29289L21.7071 15.2929C22.0976 15.6834 22.0976 16.3166 21.7071 16.7071L12.7071 25.7071C12.3166 26.0976 11.6834 26.0976 11.2929 25.7071C10.9024 25.3166 10.9024 24.6834 11.2929 24.2929L19.5858 16L11.2929 7.70711C10.9024 7.31658 10.9024 6.68342 11.2929 6.29289Z"
      fill={color}
    />
  </svg>
);

export const ArrowsLeftRight = ({ size = '32', color = 'white' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.2929 17.2929C23.6834 16.9024 24.3166 16.9024 24.7071 17.2929L28.7071 21.2929C29.0976 21.6834 29.0976 22.3166 28.7071 22.7071L24.7071 26.7071C24.3166 27.0976 23.6834 27.0976 23.2929 26.7071C22.9024 26.3166 22.9024 25.6834 23.2929 25.2929L26.5858 22L23.2929 18.7071C22.9024 18.3166 22.9024 17.6834 23.2929 17.2929Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 22C3 21.4477 3.44772 21 4 21H28C28.5523 21 29 21.4477 29 22C29 22.5523 28.5523 23 28 23H4C3.44772 23 3 22.5523 3 22Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.70711 5.29289C9.09763 5.68342 9.09763 6.31658 8.70711 6.70711L5.41421 10L8.70711 13.2929C9.09763 13.6834 9.09763 14.3166 8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289L7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 10C3 9.44772 3.44772 9 4 9H28C28.5523 9 29 9.44772 29 10C29 10.5523 28.5523 11 28 11H4C3.44772 11 3 10.5523 3 10Z"
      fill={color}
    />
  </svg>
);
