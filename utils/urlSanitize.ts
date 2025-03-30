export const sanitizeUrl = (url: string) =>
  new URL(url).hostname.replace('www.', '');
