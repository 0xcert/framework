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
 * Returns cloned object.
 * @param obj Arbitrary object. 
 */
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Updates the list of paths with connecting paths (e.g. for [a, b, c] arrays
 * [a, b] and [a] will also be added).
 */
export function stepPaths(paths: ((string|number)[])[]) {
  const items = { '': [] };

  paths.forEach((path) => {
    let variant = [];

    path.forEach((item) => {
      variant.push(item);
      items[variant.join('.')] = [...variant];
    });
  });

  return Object.keys(items).sort().map((key) => {
    return items[key];
  });
}

/**
 * Returns object value at path.
 * @param path Property path.
 * @param json Arbitrary data object.
 */
export function readPath(path, json) {
  try {
    if (!Array.isArray(path)) {
      return undefined;
    }
    else if (path.length === 0) {
      return json;
    }
    else {
      return readPath(path.slice(1), json[path[0]]);
    }
  }
  catch (e) {
    return undefined;
  }
}
