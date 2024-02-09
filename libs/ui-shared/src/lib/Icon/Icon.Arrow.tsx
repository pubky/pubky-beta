type IconProps = {
  size?: string;
  color?: string;
};

export const DropdownIcon = ({ size = '24', color = 'white' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.2803 7.71967C19.5732 8.01256 19.5732 8.48744 19.2803 8.78033L12.5303 15.5303C12.2374 15.8232 11.7626 15.8232 11.4697 15.5303L4.71967 8.78033C4.42678 8.48744 4.42678 8.01256 4.71967 7.71967C5.01256 7.42678 5.48744 7.42678 5.78033 7.71967L12 13.9393L18.2197 7.71967C18.5126 7.42678 18.9874 7.42678 19.2803 7.71967Z"
      fill={color}
    />
  </svg>
);
