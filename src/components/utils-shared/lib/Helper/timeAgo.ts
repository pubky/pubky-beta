export function timeAgo(timestamp: number, mobile?: boolean) {
  if (!timestamp) return '';

  const now = new Date().getTime();

  // If the timestamp is in the future, we consider it as "Now"
  if (timestamp > now) {
    return 'Now';
  }

  if (timestamp < 10000000000) {
    timestamp = timestamp * 1000;
  }

  const seconds = Math.floor((now - new Date(timestamp).getTime()) / 1000);

  if (seconds < 60) {
    return 'Now';
  }

  const year = mobile ? 'y' : 'year ago';
  const years = mobile ? 'y' : 'years ago';
  const month = mobile ? 'm' : 'month ago';
  const months = mobile ? 'm' : 'months ago';
  const day = mobile ? 'd' : 'day ago';
  const days = mobile ? 'd' : 'days ago';
  const hour = mobile ? 'h' : 'hour ago';
  const hours = mobile ? 'h' : 'hours ago';
  const minute = mobile ? 'min' : 'minute ago';
  const minutes = mobile ? 'min' : 'minutes ago';
  const second = mobile ? 's' : 'second ago';
  const secondsText = mobile ? 's' : 'seconds ago';
  const space = mobile ? '' : ' ';

  let interval = seconds / 31536000;
  let number = Math.floor(interval);
  if (number >= 1) {
    return `${number}${space}${number === 1 ? year : years}`;
  }

  interval = seconds / 2592000;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number}${space}${number === 1 ? month : months}`;
  }

  interval = seconds / 86400;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number}${space}${number === 1 ? day : days}`;
  }

  interval = seconds / 3600;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number}${space}${number === 1 ? hour : hours}`;
  }

  interval = seconds / 60;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number}${space}${number === 1 ? minute : minutes}`;
  }

  number = Math.floor(seconds);
  return `${number}${space}${number === 1 ? second : secondsText}`;
}

export default timeAgo;
