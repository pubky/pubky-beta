type LinksStoreAppProps = {
  width?: string;
};

export const LinksStoreApp = ({ width = 'w-80' }: LinksStoreAppProps) => {
  const bitkit = '../images/bitkit.png';
  const android = '../images/android.png';
  const iphone = '../images/iphone.png';
  const cssStyle = `${width} h-[89px] p-8 bg-gradient-to-b from-[#07040a] to-[#1b1820] rounded-2xl shadow border border-white border-opacity-20 justify-between items-start inline-flex`;
  return (
    <div className="flex-col justify-start items-start gap-6 inline-flex">
      <a target="_blank" href="https://testflight.apple.com/join/lGXhnwcC">
        <div className={cssStyle}>
          <img src={bitkit} alt="bitkit1" className="w-[70px] h-[25px]" />
          <img src={iphone} alt="iphone" className="w-[116.06px] h-6" />
        </div>
      </a>
      <a
        target="_blank"
        href="https://play.google.com/apps/testing/to.synonym.bitkit.wallet"
      >
        <div className={cssStyle}>
          <img src={bitkit} alt="bitkit" className="w-[70px] h-[25px]" />
          <img src={android} alt="android" className="w-[157.51px] h-6" />
        </div>
      </a>
    </div>
  );
};