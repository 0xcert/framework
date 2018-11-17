/**
 * Converts any value to string.
 * @param val Arbitrary value.
 */
export function toString(val) {
  try {
    return typeof val === 'undefined' || val === null ? '' : `${val}`;
  } 
  catch (e) {
    return '';
  }
}

/**
 * Updates the list of paths with connecting paths (e.g. for [a, b, c] arrays
 * [a, b] and [a] will also be added).
 */
export function stepPaths(paths: ((string|number)[])[]) {
  const items = [];

  paths.forEach((path) => {
    let variant = [];

    path.forEach((item) => {
      variant.push(item);
      items.push([...variant]);
    });
  });

  return items;
}
