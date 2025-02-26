import * as jdenticon from 'jdenticon';
import { Utils } from '@social/utils-shared';

const genJdenticon = async (id: string): Promise<File | undefined> => {
  const size = 200;
  const svgCode = jdenticon.toSvg(id, size);

  try {
    const pngBlob = await Utils.svgToPng(svgCode, size);
    const pngFile = new File([pngBlob], `${id}.png`, {
      type: 'image/png'
    });

    return pngFile;
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    return undefined;
  }
};

export default genJdenticon;
