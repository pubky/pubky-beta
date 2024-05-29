// function that gets a pubkey and turn into @xxxxx...xxxxx
export const minifyPubky = (pubky: string | null) => {
  if (!pubky) return '';

  const handler = pubky.slice(0, 4) + '...' + pubky.slice(-4);

  return `pk:${handler}`;
};

export default minifyPubky;
