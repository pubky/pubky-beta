type BgImageProps = {
  children: React.ReactNode;
  src?: string;
};

export const BgImage = ({ children, src }: BgImageProps) => {
  return (
    <div className="w-full relative bg-gradient-to-br from-black to-[#0e0e18]">
      {children}
      {src && (
        <img
          src={src}
          alt="Background Image"
          className="absolute bottom-0 right-0 max-w-[50%] max-h-[50%] z-0"
        />
      )}
    </div>
  );
};
