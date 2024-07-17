import base64ToUint8Array from './lib/Conversion/base64ToUint8Array';
import cleanText from './lib/Text/cleanText';
import copyToClipboard from './lib/Helper/copyToClipboard';
import extractHashtags from './lib/Helper/extractHashtags';
import decodePostUri from './lib/URI/decodePostUIri';
import encodePostUri from './lib/URI/encodePostUri';
import isValidContent from './lib/Text/isValidContent';
import generateRandomColor from './lib/Helper/generateRandomColor';
import hexToRgba from './lib/Helper/hetToRgba';
import minifyContent from './lib/Text/minifyContent';
import minifyPubky from './lib/Text/minifyPubky';
import storage from './lib/Storage/storage';
import timeAgo from './lib/Helper/timeAgo';
import uint8ArrayToBase64 from './lib/Conversion/uint8ArrayToBase64';
import minifyText from './lib/Text/minifyText';
import statusHelper from './lib/Helper/statusHelper';

export const Utils = {
  base64ToUint8Array,
  cleanText,
  decodePostUri,
  encodePostUri,
  isValidContent,
  generateRandomColor,
  hexToRgba,
  minifyContent,
  extractHashtags,
  minifyPubky,
  storage,
  minifyText,
  timeAgo,
  statusHelper,
  copyToClipboard,
  uint8ArrayToBase64,
};
