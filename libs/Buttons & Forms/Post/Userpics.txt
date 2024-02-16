type UserpicsProps = {
  images: { alt: string; src: string }[];
  styles?: string;
  className?: string;
};

export const Userpics = ({ images, styles, ...props }: UserpicsProps) => {
  return (
    <div
      className={`justify-start items-start inline-flex ${styles}`}
      {...props}
    >
      {images &&
        images.map((image, index) => (
          <img
            key={index}
            className={`w-8 h-8 rounded-full shadow justify-center items-center flex ${
              index > 0 && '-ml-2'
            }`}
            alt={image.alt ? image.alt : `image-${index + 1}`}
            src={image.src}
          />
        ))}
    </div>
  );
};