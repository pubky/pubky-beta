// @ts-ignore
import { blake3 } from '@noble/hashes/blake3';
import base32 from 'base32.js';

// Function to generate a Hash ID
// @ts-ignore
export async function generateHashId(data: string): Promise<string> {
  // Hash the data using blake3
  const hashBytes = blake3(data, { dkLen: 32 });

  // Take the first half of the hash bytes
  const halfLength = Math.floor(hashBytes.length / 2);
  const halfHashBytes = hashBytes.slice(0, halfLength);

  // Encode using Base32 with Crockford alphabet
  const encoder = new base32.Encoder({
    type: 'crockford',
    lc: true,
    padding: false,
  });
  const id = encoder.write(halfHashBytes).finalize();

  return id;
}
