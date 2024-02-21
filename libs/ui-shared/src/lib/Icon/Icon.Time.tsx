interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
  color?: string;
}

export const Clock = ({ size = '24', color = 'white' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.2"
      d="M12.5 21C17.4706 21 21.5 16.9706 21.5 12C21.5 7.02944 17.4706 3 12.5 3C7.52944 3 3.5 7.02944 3.5 12C3.5 16.9706 7.52944 21 12.5 21Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5 3.75C7.94365 3.75 4.25 7.44365 4.25 12C4.25 16.5563 7.94365 20.25 12.5 20.25C17.0563 20.25 20.75 16.5563 20.75 12C20.75 7.44365 17.0563 3.75 12.5 3.75ZM2.75 12C2.75 6.61522 7.11522 2.25 12.5 2.25C17.8848 2.25 22.25 6.61522 22.25 12C22.25 17.3848 17.8848 21.75 12.5 21.75C7.11522 21.75 2.75 17.3848 2.75 12Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5 6C12.9142 6 13.25 6.33579 13.25 6.75V11.25H17.75C18.1642 11.25 18.5 11.5858 18.5 12C18.5 12.4142 18.1642 12.75 17.75 12.75H12.5C12.0858 12.75 11.75 12.4142 11.75 12V6.75C11.75 6.33579 12.0858 6 12.5 6Z"
      fill={color}
    />
  </svg>
);
