import React from 'react';

export const LinksStoreApp = () => {
  const bitkit = '/images/logo-bitkit.png';
  return (
    <div>
      <a target="_blank" href="https://testflight.apple.com/join/lGXhnwcC">
        <div
          className={`mb-[24px] w-[320px] h-[89px] p-[32px] rounded-[16px] border border-solid border-[#FFFFFF29] shadow-xl bg-gradient-to-b from-[#07040a] to-[#1b1820] bg-opacity-50 flex items-center justify-between`}
        >
          <img src={bitkit} alt="Left Image" className="w-[70px] h-[25px]" />
          <img
            src="/images/logo-iphone.png"
            alt="Right Image"
            className="w-[116.06px] h-[24px]"
          />
        </div>
      </a>
      <a
        target="_blank"
        href="https://play.google.com/apps/testing/to.synonym.bitkit.wallet"
      >
        <div
          className={`w-[320px] h-[89px] p-[32px] rounded-[16px] border border-solid border-[#FFFFFF29] shadow-xl bg-gradient-to-b from-[#07040a] to-[#1b1820] bg-opacity-50 flex items-center justify-between`}
        >
          <img src={bitkit} alt="Left Image" className="w-[70px] h-[25px]" />
          <img
            src="/images/logo-android.png"
            alt="Right Image"
            className="w-[157.51px] h-[24px]"
          />
        </div>
      </a>
    </div>
  );
};
