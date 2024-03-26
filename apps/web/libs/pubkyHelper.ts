// function that gets a pubkey and turn into @xxxxx...xxxxx
export const minifyPubky = (pubky: string) => {
  const handler = pubky.slice(0, 4) + '...' + pubky.slice(-4);
  return `@${handler}`;
};
