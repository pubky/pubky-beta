type IconProps = {
  size?: string;
  color?: string;
};

export const GridFour = ({ size = '24', color = 'white' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.32">
      <path
        opacity="0.2"
        d="M12 12H19.875V4.875C19.875 4.67609 19.796 4.48532 19.6553 4.34467C19.5147 4.20402 19.3239 4.125 19.125 4.125H12V12Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.625 4.875C20.625 4.04657 19.9534 3.375 19.125 3.375L4.875 3.375C4.04657 3.375 3.375 4.04657 3.375 4.875V19.125C3.375 19.9534 4.04657 20.625 4.875 20.625H19.125C19.9534 20.625 20.625 19.9534 20.625 19.125V4.875ZM4.875 4.875L19.125 4.875V19.125H4.875V4.875Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.375C11.5858 3.375 11.25 3.71079 11.25 4.125V19.875C11.25 20.2892 11.5858 20.625 12 20.625C12.4142 20.625 12.75 20.2892 12.75 19.875L12.75 4.125C12.75 3.71079 12.4142 3.375 12 3.375Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.625 12C20.625 11.5858 20.2892 11.25 19.875 11.25L4.125 11.25C3.71079 11.25 3.375 11.5858 3.375 12C3.375 12.4142 3.71079 12.75 4.125 12.75H19.875C20.2892 12.75 20.625 12.4142 20.625 12Z"
        fill={color}
      />
    </g>
  </svg>
);
