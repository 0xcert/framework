/**
 * Converts time in milliseconds to the appropriate ethereum timestamp.
 */
export function toSeconds(milliseconds: number) {
  return parseInt(`${parseFloat(`${milliseconds}`) / 1000}`) || 0;
}
