const getCurrentUnixEpochString = () =>
  Math.floor(new Date().getTime() / 1000) + "";

module.exports = getCurrentUnixEpochString;
