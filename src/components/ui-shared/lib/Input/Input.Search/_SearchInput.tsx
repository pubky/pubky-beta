import { twMerge } from 'tailwind-merge';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput = ({ ...rest }: SearchInputProps) => {
  const baseCSS = `w-full h-12 p-6 rounded-[48px] border border-white border-opacity-20 bg-gradient-to-b from-[#07040a] to-[#1b1820] outline-none justify-between items-center inline-flex text-white text-opacity-80 placeholder:text-white placeholder:text-opacity-30 text-[15px] placeholder:text-[15px] font-semibold placeholder:font-InterTight placeholder:leading-[18px] placeholder:tracking-normal font-InterTight leading-[18px] tracking-tight`;

  return <input {...rest} className={twMerge(baseCSS, rest.className)} />;
};
