function truncateText(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + '...' : str;
}

export default truncateText;
