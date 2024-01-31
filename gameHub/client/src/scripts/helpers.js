const deepCopy = (arr) =>
  arr.map((item) => {
    return Array.isArray(item)
      ? deepCopy(item)
      : item !== null && typeof item === 'object'
      ? Object.assign({}, item)
      : item;
  });

const capper = (str) =>
  str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatTime = (totalSeconds) => {
  let seconds = totalSeconds % 60;
  let minutes = Math.floor(totalSeconds / 60);

  let timeStr =
    seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;

  return timeStr;
};

module.exports = {
  deepCopy,
  capper,
  formatTime,
};

/**
 * @description helper functions to be used throughout the entire app
 */
