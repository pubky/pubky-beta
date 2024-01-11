import React from 'react';

interface CardContentListProps {
  title?: string;
  list: string[];
}

export const CardContentList = ({ title, list }: CardContentListProps) => {
  return (
    <div>
      <h3 className="font-inter-tight text-[17px] font-semibold leading-[22px] tracking-[0.4px] text-gray-300 mb-6">
        {title}
      </h3>
      {list && (
        <ul className="font-inter-tight text-base font-normal text-[17px] leading-[22px] tracking-[0.4px] text-gray-300 ml-[10px]">
          {list.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2 text-gray-300 text-[20px]">&#8226;</span>{' '}
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
