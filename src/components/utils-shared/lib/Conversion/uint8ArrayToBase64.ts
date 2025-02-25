export const uint8ArrayToBase64 = (uint8Array: any) => {
  let binaryString = '';
  uint8Array.forEach((byte: any) => {
    binaryString += String.fromCharCode(byte);
  });
  return window.btoa(binaryString);
};

export default uint8ArrayToBase64;
