/**
 * Converts any value to string following the procedure in ES6 7.1.12.
 * https://www.ecma-international.org/ecma-262/6.0/#sec-tostring
 * @param val Arbitrary value.
 */
export function toString(val: any): string {
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
export function readPath(path: any, json: any): any {
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

/**
 * Sets value at path for the provided json object and returns the updated json.
 * @param path Property path.
 * @param value Property value.
 * @param json Arbitrary data object.
 */
export function writePath(path: any, value: any, json: any = {}) {
  json = json || {};

  let obj = json;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    const nextKey = path[i + 1];

    if (typeof nextKey === 'undefined') {
      obj[key] = value;
    } else {
      if (typeof nextKey === 'number' && typeof obj[key] === 'undefined') {
        obj[key] = [];
      } else if (typeof obj[key] === 'undefined') {
        obj[key] = {};
      }
      obj = obj[key];
    }
  }

  return JSON.parse(JSON.stringify(json));
}
