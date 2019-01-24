/**
 * Universal fetch method reads remote or local file.
 * @param path URL or local path.
 */
export async function fetch(path, options?) {
  if (typeof window !== 'undefined') {
    return window.fetch(path, options);
  } else {
    return require('node-fetch')(path, options);
  }
}
