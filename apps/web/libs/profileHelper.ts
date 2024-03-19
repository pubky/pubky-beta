// function that gets a pubkey and turn into @xxxxx...xxxxx
export const minifyPubkey = (pubkey: string) => {
  const handler = pubkey.slice(0, 4) + '...' + pubkey.slice(-4);
  return `@${handler}`;
};
