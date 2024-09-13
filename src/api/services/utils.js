/**
 * Returns an new Object, reduced to the keys given
 * @param {Object} obj from which to take the values
 * @param {String[]} keys to keep
 */
export function reduceObject(obj, keys) {
  return Object.keys().reduce((acc, key) => {
    if (keys.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  });
}
