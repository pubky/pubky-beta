export function timeAgo(timestamp: number, mobile?: boolean) {
  if (!timestamp) return '';

  const now = new Date().getTime();
  if (timestamp > now) {
    timestamp = timestamp / 1000;
  } else if (timestamp < 10000000000) {
    timestamp = timestamp * 1000;
  }

  const seconds = Math.floor((now - new Date(timestamp).getTime()) / 1000);

  if (seconds < 60) {
    return 'Now';
  }

  let interval = seconds / 31536000;
  let number = Math.floor(interval);

  const year = mobile ? 'y' : number === 1 ? 'year ago' : 'years ago';
  const month = mobile ? 'm' : number === 1 ? 'month ago' : 'months ago';
  const days = mobile ? 'd' : number === 1 ? 'day ago' : 'days ago';
  const hours = mobile ? 'h' : number === 1 ? 'hour ago' : 'hours ago';
  const minutes = mobile ? 'min' : number === 1 ? 'minute ago' : 'minutes ago';
  const second = mobile ? 's' : number === 1 ? 'second ago' : 'seconds ago';
  const space = mobile ? '' : ' ';

  if (number >= 1) {
    return `${number}${space}${year}`;
  }

  interval = seconds / 2592000;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number}${space}${month}`;
  }

  interval = seconds / 86400;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number}${space}${days}`;
  }

  interval = seconds / 3600;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number}${space}${hours}`;
  }

  interval = seconds / 60;
  number = Math.floor(interval);
  if (number >= 1) {
    return `${number}${space}${minutes}`;
  }

  number = Math.floor(seconds);
  return `${number}${space}${second}`;
}

export default timeAgo;
