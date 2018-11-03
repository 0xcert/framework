import { isDate } from './is-date';
import { isPresent } from './is-present';
import { isInteger } from './is-integer';

/**
 * Converts the provided value to date.
 * @param v Arbitrary value.
 */
export function toDate(v?: any): Date {
  const date = isDate(v) ? v : new Date(v);
  const time = date.getTime();
  const isValid = (
    isPresent(v)
    && isInteger(time)
  );

  return isValid ? date : null;
}
