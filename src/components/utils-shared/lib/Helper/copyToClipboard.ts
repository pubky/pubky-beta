const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.log('Failed to copy: ', error);
  }
};

export default copyToClipboard;
