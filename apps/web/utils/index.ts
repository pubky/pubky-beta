import base64ToUint8Array from './_base64ToUint8Array';
import cleanText from './_cleanText';
import copyToClipboard from './_copytoClipboard';
import decodePostUri from './_decodePostUIri';
import encodePostUri from './_encodePostUri';
import isValidContent from './_isValidContent';
import minifyPubky from './_minifyPubky';
import minifyText from './_minifyText';
import statusHelper from './_statusHelper';
import storage from './_storage';
import timeAgo from './_timeAgo';
import uint8ArrayToBase64 from './_uint8ArrayToBase64';

export const Utils = {
  base64ToUint8Array,
  cleanText,
  decodePostUri,
  encodePostUri,
  isValidContent,
  minifyPubky,
  storage,
  minifyText,
  timeAgo,
  statusHelper,
  copyToClipboard,
  uint8ArrayToBase64,
};
