const debounce = (cb, timeout) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => cb.apply(null, args), timeout);
  };
};
