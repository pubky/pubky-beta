const sanitizeUrlsArticle = (html: string): string => {
  return html.replace(/href="([^"]*?)"/g, (match, url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return match;
    }
    return `href="https://${url}"`;
  });
};

export default sanitizeUrlsArticle;
