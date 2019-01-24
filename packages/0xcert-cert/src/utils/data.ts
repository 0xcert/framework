/**
 * Converts any value to string.
 * @param val Arbitrary value.
 */
export function toString(val): string {
  try {
    return typeof val === 'undefined' || val === null ? '' : `${val}`;
  } catch (e) {
    return '';
  }
}

/**
 * Returns cloned object.
 * @param obj Arbitrary object.
 */
export function cloneObject(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Updates the list of paths with connecting paths (e.g. for [a, b, c] arrays
 * [a, b] and [a] will also be added).
 */
export function stepPaths(paths: ((string | number)[])[]): any[] {
  const items = { '': [] };

  paths.forEach((path: any) => {
    const variant = [];

    path.forEach((item: any) => {
      variant.push(item);
      items[variant.join('.')] = [...variant];
    });
  });

  return Object.keys(items).sort().map((key: any) => {
    return items[key];
  });
}

/**
 * Returns object value at path.
 * @param path Property path.
 * @param json Arbitrary data object.
 */
export function readPath(path, json): any {
  try {
    if (!Array.isArray(path)) {
      return undefined;
    } else if (path.length === 0) {
      return json;
    } else {
      return readPath(path.slice(1), json[path[0]]);
    }
  } catch (e) {
    return undefined;
  }
}
