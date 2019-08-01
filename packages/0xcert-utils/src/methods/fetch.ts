/**
 * Universal fetch method reads remote or local file.
 * @param path URL or local path.
 */
export async function fetch(path, options?) {
  if (typeof window !== 'undefined') {
    return (window as any).fetch(path, options);
  } else if (path.lastIndexOf('http', 0) !== 0) {
    return new Promise((resolve, reject) => {
      require('fs').readFile(path, 'utf8', function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  } else {
    return require('node-fetch')(path, options);
  }
}
