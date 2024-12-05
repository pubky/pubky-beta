import base32 from 'base32.js';

// Function to write a BigInt into an ArrayBuffer in Big-Endian format
function writeBigUint64BE(
  buffer: ArrayBuffer,
  value: bigint,
  offset = 0
): void {
  const view = new DataView(buffer);
  for (let i = 7; i >= 0; i--) {
    view.setUint8(offset + i, Number(value & BigInt(0xff)));
    value = value >> BigInt(8);
  }
}

// Function to generate a Timestamp ID
export function generateTimestampId(): string {
  // Get the current time in microseconds since the UNIX epoch
  const now = BigInt(Date.now()) * BigInt(1000); // milliseconds to microseconds

  // Create an 8-byte buffer
  const buffer = new ArrayBuffer(8);
  writeBigUint64BE(buffer, now);

  // Encode the buffer in Base32 (Crockford alphabet)
  const encoder = new base32.Encoder({
    type: 'crockford',
    lc: true,
    padding: false,
  });
  const bytes = new Uint8Array(buffer);
  const id = encoder.write(bytes).finalize();

  return id;
}
