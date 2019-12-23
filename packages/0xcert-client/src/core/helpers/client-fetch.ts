import { ClientFetchError } from './client-fetch-error';

/**
 * Universal fetch method reads remote or local file.
 * @param path URL or local path.
 * @param options Options.
 */
export default async function clientFetch(path, options?) {
  const method = typeof window !== 'undefined'
    ? (window as any).fetch(path, options)
    : require('node-fetch')(path, options);
  return method.then(async (r) => {
    if (r.status && r.status >= 400) {
      throw new ClientFetchError(await r.json(), r.status);
    } else {
      return r.json();
    }
  });
}
