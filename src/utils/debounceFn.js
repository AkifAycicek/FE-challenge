let debounce = null;

/**
 * Author: Akif Ayçiçek
 *
 * @param {Function} action Debounce action.
 * @param {Number} ms Delay in miliseconds.
 */
export default (action, ms) => {
  clearTimeout(debounce);
  debounce = setTimeout(() => action(), ms);
  return debounce;
};
