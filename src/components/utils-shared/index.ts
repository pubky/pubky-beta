import base64ToUint8Array from './lib/Conversion/base64ToUint8Array';
import svgToPng from './lib/Conversion/svgToPng';
import cleanText from './lib/Text/cleanText';
import copyToClipboard from './lib/Helper/copyToClipboard';
import extractHashtags from './lib/Helper/extractHashtags';
import encodeImageId from './lib/URI/encodeImageId';
import encodePostUri from './lib/URI/encodePostUri';
import encodePostUri2 from './lib/URI/encodePostUri2';
import isValidContent from './lib/Text/isValidContent';
import generateRandomColor from './lib/Helper/generateRandomColor';
import hexToRgba from './lib/Helper/hetToRgba';
import minifyContent from './lib/Text/minifyContent';
import minifyPubky from './lib/Text/minifyPubky';
import storage from './lib/Storage/storage';
import timeAgo from './lib/Helper/timeAgo';
import formatTimestamp from './lib/Helper/formatTimestamp';
import uint8ArrayToBase64 from './lib/Conversion/uint8ArrayToBase64';
import minifyText from './lib/Text/minifyText';
import promptPlaceholder from './lib/Text/promptPlaceholder';
import statusHelper from './lib/Helper/statusHelper';
import { supportedImageTypes } from './lib/Helper/FileType/_image';
import { supportedVideoTypes } from './lib/Helper/FileType/_video';
import { supportedAudioTypes } from './lib/Helper/FileType/_audio';
import truncateText from './lib/Text/truncateText';
import truncateTag from './lib/Text/truncateTag';
import genJdenticon from './lib/Helper/genJdenticon';
import sanitizeUrlsArticle from './lib/Helper/sanitizeUrlsArticle';
import { resizeImageFile } from './lib/Helper/resizeImageFile';
import { censoredTags } from './lib/Helper/Moderation/censoredTags';
import isPostCensored from './lib/Helper/Moderation/isPostCensored';
import isProfileCensored from './lib/Helper/Moderation/isProfileCensored';
import { inviteCodeMask } from './lib/Helper/inviteCodeMask';

export const Utils = {
  base64ToUint8Array,
  svgToPng,
  cleanText,
  censoredTags,
  encodeImageId,
  encodePostUri,
  encodePostUri2,
  isValidContent,
  isPostCensored,
  isProfileCensored,
  generateRandomColor,
  hexToRgba,
  minifyContent,
  extractHashtags,
  minifyPubky,
  storage,
  minifyText,
  inviteCodeMask,
  promptPlaceholder,
  timeAgo,
  formatTimestamp,
  statusHelper,
  supportedImageTypes,
  supportedVideoTypes,
  supportedAudioTypes,
  copyToClipboard,
  uint8ArrayToBase64,
  truncateText,
  truncateTag,
  genJdenticon,
  sanitizeUrlsArticle,
  resizeImageFile
};
