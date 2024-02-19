type IconProps = {
  size?: string;
  color?: string;
};

export const Asterisk = ({ size = '24', color = 'white' }: IconProps) => (
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
      d="M12 3C12.4142 3 12.75 3.33579 12.75 3.75V20.25C12.75 20.6642 12.4142 21 12 21C11.5858 21 11.25 20.6642 11.25 20.25V3.75C11.25 3.33579 11.5858 3 12 3Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.20577 7.5C4.41288 7.14128 4.87157 7.01838 5.23029 7.22548L19.5197 15.4755C19.8784 15.6826 20.0013 16.1413 19.7942 16.5C19.5871 16.8587 19.1284 16.9816 18.7697 16.7745L4.48029 8.52452C4.12157 8.31742 3.99866 7.85872 4.20577 7.5Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.7942 7.5C20.0013 7.85872 19.8784 8.31742 19.5197 8.52452L5.23029 16.7745C4.87157 16.9816 4.41288 16.8587 4.20577 16.5C3.99866 16.1413 4.12157 15.6826 4.48029 15.4755L18.7697 7.22548C19.1284 7.01838 19.5871 7.14128 19.7942 7.5Z"
      fill={color}
    />
  </svg>
);
