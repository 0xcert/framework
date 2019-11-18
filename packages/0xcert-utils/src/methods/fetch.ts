/**
 * Universal fetch method reads remote or local JSON file.
 * @param path URL or local path.
 */
export async function fetchJson(path, options?): Promise<any> {
  if (typeof window !== 'undefined') {
    return (window as any).fetch(path, options).then((r) => r.json());
  } else if (path.lastIndexOf('http', 0) !== 0) {
    try { // UI with SSR sometimes can't find `fs` module, but it's not needed
      return require('fs').promises.readFile(path, 'utf8').then((d) => JSON.parse(d));
    } catch (e) {
      return null;
    }
  } else {
    return require('node-fetch')(path, options).then((r) => r.json());
  }
}
