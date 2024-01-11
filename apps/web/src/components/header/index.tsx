import React from 'react';

interface HeaderProps {
  children?: React.ReactNode;
  logo: string;
  titlePage?: string;
}

const Header = ({ children, logo, titlePage }: HeaderProps) => {
  return (
    <header className="max-w-[1370px] max-h-[144px] mx-auto py-12 px-20 flex items-center justify-between">
      <div className="shrink-0">
        <img src={logo} alt="Logo" className="w-[167.04px] h-[48px]" />
      </div>
      <div className="grow ml-[24px] mr-[48px]">
        {titlePage && (
          <h1 className="font-inter-tight font-light text-[30px] leading-[30px] tracking-[-0.3px] text-[#FFFFFF80]">
            {titlePage}
          </h1>
        )}
      </div>
      {children}
    </header>
  );
};

export default Header;
