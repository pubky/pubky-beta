type ImageProps = {
  src: string;
  styles?: string;
  className?: string;
  alt?: string;
};

export const Image = ({
  src,
  styles,
  alt = 'image',
  ...props
}: ImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`${styles}`}
      {...props}
    />
  );
};
