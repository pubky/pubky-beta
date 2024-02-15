import { Typography } from '../Typography';
import { Image } from './Image';

type HeaderProps = {
  children?: React.ReactNode;
  logo?: string;
  titlePage?: string;
  styles?: string;
  className?: string;
};

export const Header = ({
  children,
  logo = '../images/pubky.png',
  titlePage,
  styles,
  ...props
}: HeaderProps) => {
  const cssStyle =
    'sticky top-0 z-50 bg-transparent bg-opacity-50 backdrop-blur-[80px] max-h-36 mx-auto py-12 px-40 gap-6 flex items-center justify-between';
  return (
    <header className={`${cssStyle} ${styles}`} {...props}>
      <a href="/">
        <Image src={logo} alt="Logo" />
      </a>
      <div className="grow pr-6">
        {titlePage && (
          <Typography.PageTitle color="text-white text-opacity-50">
            {titlePage}
          </Typography.PageTitle>
        )}
      </div>
      {children}
    </header>
  );
};

