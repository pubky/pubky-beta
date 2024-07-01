export function timeAgo(timestamp: number) {
  if (!timestamp) return '';

  const now = new Date().getTime();
  if (timestamp > now) {
    timestamp = timestamp / 1000;
  } else if (timestamp < 10000000000) {
    timestamp = timestamp * 1000;
  }

  const seconds = Math.floor((now - new Date(timestamp).getTime()) / 1000);

  let interval = seconds / 31536000;
  let number = Math.floor(interval);

  if (number >= 1) {
    return `${number} ${number === 1 ? 'year' : 'years'} ago`;
  }

  interval = seconds / 2592000;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number} ${number === 1 ? 'month' : 'months'} ago`;
  }

  interval = seconds / 86400;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number} ${number === 1 ? 'day' : 'days'} ago`;
  }

  interval = seconds / 3600;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number} ${number === 1 ? 'hour' : 'hours'} ago`;
  }

  interval = seconds / 60;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number} ${number === 1 ? 'minute' : 'minutes'} ago`;
  }

  number = Math.floor(seconds);
  return `${number} ${number === 1 ? 'second' : 'seconds'} ago`;
}

export default timeAgo;
