export function timeAgo(date: string | Date | null) {
  if (!date) return '';
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

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
