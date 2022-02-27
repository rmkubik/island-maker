const debounceTrailingEdge = (debounceInterval) => {
  let timeout;

  return (callback) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(callback, debounceInterval);
  };
};

export default debounceTrailingEdge;
